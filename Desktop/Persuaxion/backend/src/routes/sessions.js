// ============================================================
// SESSION DETAIL ROUTE
//
// GET /api/sessions/:session_id
//
// Returns a complete picture of one session:
//   - Session identity and page context
//   - Current intent state
//   - Signal breakdown (type, count, total score contribution)
//   - Full transition history (chronological)
//   - Recent raw events (last 20, for debugging)
//
// Intended for dashboard drill-down and debugging.
// All queries are reads only.
// ============================================================

const express = require('express');
const db      = require('../db');

const router = express.Router();

router.get('/:session_id', async (req, res) => {
  const { session_id } = req.params;

  // Lightweight UUID format check before hitting DB
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(session_id)) {
    return res.status(400).json({ error: 'Invalid session_id format' });
  }

  try {
    // Run all four queries in parallel — no interdependencies
    const [sessionResult, signalsResult, transitionsResult, eventsResult] =
      await Promise.all([

        // ── SESSION + INTENT STATE (single join) ────────────────
        db.query(
          `SELECT
             s.session_id,
             s.anonymous_user_id,
             s.shop_domain,
             s.shopify_customer_id,
             s.is_new_user,
             s.page_type,
             s.product_id,
             s.variant_id,
             s.started_at,
             s.last_active_at,
             i.intent,
             i.score,
             i.confidence,
             i.explicit_detected,
             i.first_detected_at,
             i.last_updated_at,
             i.top_signals
           FROM sessions s
           LEFT JOIN intent_states i ON s.session_id = i.session_id
           WHERE s.session_id = $1`,
          [session_id]
        ),

        // ── SIGNAL BREAKDOWN ────────────────────────────────────
        // Per-signal-type: how many fired, total score contributed.
        // Covers all time (not rolling window) — gives full picture.
        db.query(
          `SELECT
             signal_type,
             COUNT(*)::INT          AS event_count,
             SUM(score_value)::INT  AS total_score_contribution,
             BOOL_OR(is_explicit)   AS any_explicit,
             MIN(detected_at)       AS first_seen_at,
             MAX(detected_at)       AS last_seen_at
           FROM normalized_signals
           WHERE session_id = $1
           GROUP BY signal_type
           ORDER BY total_score_contribution DESC, event_count DESC`,
          [session_id]
        ),

        // ── TRANSITION HISTORY ──────────────────────────────────
        // Full audit trail of confidence level changes.
        db.query(
          `SELECT
             from_confidence,
             to_confidence,
             score_at_transition,
             triggering_signal,
             transitioned_at
           FROM intent_transitions
           WHERE session_id = $1
           ORDER BY transitioned_at ASC`,
          [session_id]
        ),

        // ── RECENT RAW EVENTS ───────────────────────────────────
        // Last 20 events for debugging signal detection.
        db.query(
          `SELECT
             event_type,
             timestamp,
             page_type,
             product_id,
             element_text,
             element_type,
             metadata
           FROM raw_events
           WHERE session_id = $1
           ORDER BY timestamp DESC
           LIMIT 20`,
          [session_id]
        ),

      ]);

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = sessionResult.rows[0];

    return res.status(200).json({
      session: {
        session_id:           session.session_id,
        anonymous_user_id:    session.anonymous_user_id,
        shop_domain:          session.shop_domain,
        shopify_customer_id:  session.shopify_customer_id,
        is_new_user:          session.is_new_user,
        page_type:            session.page_type,
        product_id:           session.product_id,
        variant_id:           session.variant_id,
        started_at:           session.started_at,
        last_active_at:       session.last_active_at,
      },

      intent_state: session.intent
        ? {
            intent:            session.intent,
            score:             session.score,
            confidence:        session.confidence,
            explicit_detected: session.explicit_detected,
            first_detected_at: session.first_detected_at,
            last_updated_at:   session.last_updated_at,
            top_signals:       session.top_signals || [],
          }
        : null,

      signal_breakdown: signalsResult.rows.map((row) => ({
        signal_type:               row.signal_type,
        event_count:               row.event_count,
        total_score_contribution:  row.total_score_contribution,
        any_explicit:              row.any_explicit,
        first_seen_at:             row.first_seen_at,
        last_seen_at:              row.last_seen_at,
      })),

      transition_history: transitionsResult.rows.map((row) => ({
        from_confidence:     row.from_confidence,
        to_confidence:       row.to_confidence,
        score_at_transition: row.score_at_transition,
        triggering_signal:   row.triggering_signal,
        transitioned_at:     row.transitioned_at,
      })),

      recent_events: eventsResult.rows.map((row) => ({
        event_type:   row.event_type,
        timestamp:    row.timestamp,
        page_type:    row.page_type,
        product_id:   row.product_id,
        element_text: row.element_text,
        element_type: row.element_type,
        metadata:     row.metadata,
      })),
    });

  } catch (err) {
    console.error('[GET /api/sessions/:session_id] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
