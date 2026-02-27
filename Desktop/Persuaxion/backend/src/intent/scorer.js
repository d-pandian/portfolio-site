// ============================================================
// ROLLING WINDOW SCORER
// Reads normalized_signals for a session from the last 10 minutes,
// applies caps, and returns the current score + supporting state.
//
// CONTRACT:
//   - Reads from DB (normalized_signals table only)
//   - Never writes to DB
//   - Returns a plain object — no side effects
// ============================================================

const {
  VARIANT_EXPLORATION_CAP,
  ROLLING_WINDOW_MS,
  COMBO_WINDOW_MS,
} = require('../signals/constants');

const PRIMARY_SIGNALS = new Set([
  'SIZE_CONTENT_INTERACTION',
  'USAGE_CONTENT_INTERACTION',
  'REVIEW_FIT_INTERACTION',
  'RETURN_RISK_CHECK',
]);

/**
 * @typedef {Object} ScoreResult
 * @property {number}   score                  - Total score in rolling window
 * @property {string[]} topSignals             - Top 3 signal types by frequency
 * @property {boolean}  explicitDetected       - Any EXPLICIT_QUERY in window
 * @property {boolean}  hasRecentPrimarySignal - Any primary signal in last 5 min
 */

/**
 * Calculates the current intent score from the rolling window.
 * @param {string} sessionId
 * @param {Object} client - pg pool or client
 * @returns {Promise<ScoreResult>}
 */
async function calculateScore(sessionId, client) {
  const windowStart = new Date(Date.now() - ROLLING_WINDOW_MS).toISOString();

  const { rows: signals } = await client.query(
    `SELECT signal_type, score_value, is_explicit, detected_at
     FROM normalized_signals
     WHERE session_id = $1
       AND detected_at > $2
     ORDER BY detected_at ASC`,
    [sessionId, windowStart]
  );

  let score           = 0;
  let variantCount    = 0;
  let explicitDetected = false;
  const signalCounts  = {};
  const comboWindowStart = new Date(Date.now() - COMBO_WINDOW_MS);
  let hasRecentPrimarySignal = false;

  for (const signal of signals) {
    const { signal_type, score_value, is_explicit, detected_at } = signal;

    // Track explicit detection
    if (is_explicit) {
      explicitDetected = true;
    }

    // Apply variant cap — only count first N variant signals
    if (signal_type === 'VARIANT_EXPLORATION') {
      if (variantCount < VARIANT_EXPLORATION_CAP) {
        score += score_value;
        variantCount++;
      }
      // Silent skip if cap exceeded — no error, no log
    } else {
      score += score_value;
    }

    // Count per signal type for top signals calculation
    signalCounts[signal_type] = (signalCounts[signal_type] || 0) + 1;

    // Check if a primary signal exists within the combo window
    if (
      PRIMARY_SIGNALS.has(signal_type) &&
      new Date(detected_at) > comboWindowStart
    ) {
      hasRecentPrimarySignal = true;
    }
  }

  // Top signals: sorted by frequency descending, take top 3
  const topSignals = Object.entries(signalCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type);

  return { score, topSignals, explicitDetected, hasRecentPrimarySignal };
}

module.exports = { calculateScore };
