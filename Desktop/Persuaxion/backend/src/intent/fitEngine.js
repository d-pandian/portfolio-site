// ============================================================
// FIT INTENT ENGINE — ORCHESTRATOR
// Runs the full intent pipeline for a single raw event.
//
// Pipeline:
//   rawEvent
//     → mapper.mapToSignals()        [pure, no DB]
//     → INSERT normalized_signals    [DB write]
//     → scorer.calculateScore()      [DB read]
//     → transitions.scoreToConfidence() [pure]
//     → UPSERT intent_states         [DB write]
//     → INSERT intent_transitions    [DB write, conditional]
//
// Called from routes/events.js inside a transaction.
// Accepts a pg client (not pool) to stay within the transaction.
// ============================================================

const { mapToSignals }        = require('../signals/mapper');
const { calculateScore }      = require('./scorer');
const { scoreToConfidence, shouldLogTransition } = require('./transitions');
const { COMBO_MINIMUM_SCORE } = require('../signals/constants');

/**
 * Processes a raw event through the full fit intent pipeline.
 * @param {Object} rawEvent    - Validated raw event body from SDK
 * @param {string} rawEventId  - UUID of the inserted raw_events row
 * @param {Object} client      - Active pg transaction client
 * @returns {Promise<void>}
 */
async function processEvent(rawEvent, rawEventId, client) {
  const { session_id } = rawEvent;

  // ── STEP 1: Map raw event to signals ─────────────────────────
  const signals = mapToSignals(rawEvent);

  // Nothing to process — event carries no intent signal
  if (signals.length === 0) return;

  // ── STEP 2: Persist normalized signals ───────────────────────
  const now = new Date().toISOString();

  for (const signal of signals) {
    await client.query(
      `INSERT INTO normalized_signals
         (session_id, raw_event_id, signal_type, intent_category,
          score_value, is_explicit, detected_at, metadata)
       VALUES ($1, $2, $3, 'fit_usage', $4, $5, $6, $7)`,
      [
        session_id,
        rawEventId,
        signal.signalType,
        signal.scoreValue,
        signal.isExplicit,
        now,
        signal.metadata ? JSON.stringify(signal.metadata) : null,
      ]
    );
  }

  // ── STEP 3: Calculate score from rolling window ───────────────
  const { score, topSignals, explicitDetected, hasRecentPrimarySignal } =
    await calculateScore(session_id, client);

  // ── STEP 4: Fetch current persisted state ─────────────────────
  const { rows: existing } = await client.query(
    `SELECT confidence, explicit_detected, first_detected_at
     FROM intent_states
     WHERE session_id = $1`,
    [session_id]
  );

  const currentConfidence   = existing.length > 0 ? existing[0].confidence        : 'none';
  const persistedExplicit   = existing.length > 0 ? existing[0].explicit_detected : false;
  const hadFirstDetection   = existing.length > 0 && existing[0].first_detected_at !== null;

  // Explicit detection is sticky — once true, never reverts
  const effectiveExplicit = explicitDetected || persistedExplicit;

  // ── STEP 5: Apply combo rule ──────────────────────────────────
  // Explicit query + any primary signal within 5 min → floor score at Strong
  const adjustedScore = (effectiveExplicit && hasRecentPrimarySignal)
    ? Math.max(score, COMBO_MINIMUM_SCORE)
    : score;

  const newConfidence = scoreToConfidence(adjustedScore);

  // Set first_detected_at only when session first exits 'none'
  const setFirstDetectedNow = !hadFirstDetection && newConfidence !== 'none';

  // ── STEP 6: Upsert intent state ───────────────────────────────
  await client.query(
    `INSERT INTO intent_states
       (session_id, intent, score, confidence, explicit_detected,
        first_detected_at, last_updated_at, top_signals)
     VALUES ($1, 'fit_usage', $2, $3, $4, $5, NOW(), $6)
     ON CONFLICT (session_id) DO UPDATE SET
       score             = EXCLUDED.score,
       confidence        = EXCLUDED.confidence,
       explicit_detected = intent_states.explicit_detected OR EXCLUDED.explicit_detected,
       first_detected_at = COALESCE(
         intent_states.first_detected_at,
         EXCLUDED.first_detected_at
       ),
       last_updated_at   = EXCLUDED.last_updated_at,
       top_signals       = EXCLUDED.top_signals`,
    [
      session_id,
      adjustedScore,
      newConfidence,
      effectiveExplicit,
      setFirstDetectedNow ? now : null,
      JSON.stringify(topSignals),
    ]
  );

  // ── STEP 7: Log confidence transition (upward only) ───────────
  if (shouldLogTransition(currentConfidence, newConfidence)) {
    // Use the last signal that arrived as the triggering signal
    const triggeringSignal = signals[signals.length - 1].signalType;

    await client.query(
      `INSERT INTO intent_transitions
         (session_id, intent, from_confidence, to_confidence,
          score_at_transition, triggering_signal, transitioned_at)
       VALUES ($1, 'fit_usage', $2, $3, $4, $5, NOW())`,
      [session_id, currentConfidence, newConfidence, adjustedScore, triggeringSignal]
    );
  }
}

module.exports = { processEvent };
