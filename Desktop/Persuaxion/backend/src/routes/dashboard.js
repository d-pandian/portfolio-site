// ============================================================
// DASHBOARD API ROUTES
//
// GET /api/dashboard/metrics  — Aggregate KPIs for a shop
// GET /api/dashboard/feed     — Paginated live session feed
//
// Both require ?shop_domain query param.
// All queries run against the read side only (no writes).
// ============================================================

const express = require('express');
const db      = require('../db');

const router = express.Router();

// ── SHARED VALIDATION ─────────────────────────────────────────

function requireShopDomain(req, res, next) {
  if (!req.query.shop_domain) {
    return res.status(400).json({ error: 'Missing required query param: shop_domain' });
  }
  next();
}

// ============================================================
// GET /api/dashboard/metrics
//
// Returns aggregate KPIs for a single shop using one SQL query
// with conditional aggregation (no N+1, no subqueries).
//
// Response:
// {
//   total_pdp_sessions:       number,
//   medium_fit_sessions:      number,
//   strong_plus_fit_sessions: number,
//   new_user_sessions:        number,
//   returning_user_sessions:  number
// }
// ============================================================

router.get('/metrics', requireShopDomain, async (req, res) => {
  const { shop_domain } = req.query;

  try {
    // Single pass over sessions + intent_states using conditional aggregation.
    // LEFT JOIN keeps sessions that have no intent_state row (not yet scored).
    const { rows } = await db.query(
      `SELECT
         COUNT(DISTINCT s.session_id)
           FILTER (WHERE s.page_type = 'product')
           AS total_pdp_sessions,

         COUNT(DISTINCT s.session_id)
           FILTER (WHERE i.confidence = 'medium')
           AS medium_fit_sessions,

         COUNT(DISTINCT s.session_id)
           FILTER (WHERE i.confidence IN ('strong', 'very_strong'))
           AS strong_plus_fit_sessions,

         COUNT(DISTINCT s.session_id)
           FILTER (WHERE s.is_new_user = TRUE)
           AS new_user_sessions,

         COUNT(DISTINCT s.session_id)
           FILTER (WHERE s.is_new_user = FALSE)
           AS returning_user_sessions

       FROM sessions s
       LEFT JOIN intent_states i ON s.session_id = i.session_id
       WHERE s.shop_domain = $1`,
      [shop_domain]
    );

    const row = rows[0];

    return res.status(200).json({
      total_pdp_sessions:       parseInt(row.total_pdp_sessions,       10),
      medium_fit_sessions:      parseInt(row.medium_fit_sessions,      10),
      strong_plus_fit_sessions: parseInt(row.strong_plus_fit_sessions, 10),
      new_user_sessions:        parseInt(row.new_user_sessions,        10),
      returning_user_sessions:  parseInt(row.returning_user_sessions,  10),
    });

  } catch (err) {
    console.error('[GET /api/dashboard/metrics] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================
// GET /api/dashboard/feed
//
// Returns a paginated list of sessions that have a detected
// intent (confidence != 'none'), sorted by most recently updated.
//
// Query params:
//   shop_domain  (required)
//   page         (optional, default 1)
//   limit        (optional, default 20, max 100)
//   confidence   (optional filter: 'medium'|'strong'|'very_strong')
//
// Response:
// {
//   sessions: [{
//     session_id, product_id, is_new_user,
//     confidence, score, top_signals,
//     explicit_detected, last_updated_at, first_detected_at,
//     chat_snippet
//   }],
//   pagination: { page, limit, total, total_pages }
// }
// ============================================================

router.get('/feed', requireShopDomain, async (req, res) => {
  const { shop_domain, confidence } = req.query;

  // Parse + clamp pagination params
  const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const offset = (page - 1) * limit;

  // Optional confidence filter
  const VALID_CONFIDENCE = new Set(['medium', 'strong', 'very_strong']);
  const confidenceFilter = confidence && VALID_CONFIDENCE.has(confidence)
    ? confidence
    : null;

  try {
    // ── COUNT QUERY ─────────────────────────────────────────────
    // Run count and data queries in parallel — they read the same
    // snapshot and neither writes.
    const countQuery = db.query(
      `SELECT COUNT(*) AS total
       FROM sessions s
       INNER JOIN intent_states i ON s.session_id = i.session_id
       WHERE s.shop_domain = $1
         AND i.confidence != 'none'
         AND ($2::TEXT IS NULL OR i.confidence = $2)`,
      [shop_domain, confidenceFilter]
    );

    // ── DATA QUERY ──────────────────────────────────────────────
    // LATERAL subquery fetches the most recent chat message text
    // for display in the feed without a separate round-trip.
    const dataQuery = db.query(
      `SELECT
         s.session_id,
         s.product_id,
         s.is_new_user,
         i.confidence,
         i.score,
         i.top_signals,
         i.explicit_detected,
         i.first_detected_at,
         i.last_updated_at,
         chat.element_text AS chat_snippet

       FROM sessions s
       INNER JOIN intent_states i ON s.session_id = i.session_id

       -- Most recent chat message for this session (if any)
       LEFT JOIN LATERAL (
         SELECT element_text
         FROM raw_events
         WHERE session_id = s.session_id
           AND event_type = 'chat_message'
           AND element_text IS NOT NULL
         ORDER BY timestamp DESC
         LIMIT 1
       ) chat ON TRUE

       WHERE s.shop_domain = $1
         AND i.confidence != 'none'
         AND ($2::TEXT IS NULL OR i.confidence = $2)

       ORDER BY i.last_updated_at DESC
       LIMIT  $3
       OFFSET $4`,
      [shop_domain, confidenceFilter, limit, offset]
    );

    const [countResult, dataResult] = await Promise.all([countQuery, dataQuery]);

    const total       = parseInt(countResult.rows[0].total, 10);
    const total_pages = Math.ceil(total / limit);

    return res.status(200).json({
      sessions: dataResult.rows.map((row) => ({
        session_id:       row.session_id,
        product_id:       row.product_id,
        is_new_user:      row.is_new_user,
        confidence:       row.confidence,
        score:            row.score,
        top_signals:      row.top_signals || [],
        explicit_detected: row.explicit_detected,
        first_detected_at: row.first_detected_at,
        last_updated_at:  row.last_updated_at,
        chat_snippet:     row.chat_snippet || null,
      })),
      pagination: { page, limit, total, total_pages },
    });

  } catch (err) {
    console.error('[GET /api/dashboard/feed] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
