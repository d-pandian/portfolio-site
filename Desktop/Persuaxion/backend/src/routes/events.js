// ============================================================
// POST /api/events
// Ingests a single raw event from the JS SDK.
//
// Processing order (all within one DB transaction):
//   1. Upsert shop
//   2. Upsert session
//   3. Insert raw_event
//   4. Run intent pipeline (fitEngine)
//   5. Commit → 200 OK
//
// The entire pipeline is synchronous within the HTTP request.
// No queues. No background jobs. Designed for V1 volume.
// ============================================================

const express          = require('express');
const { v4: uuidv4 }  = require('uuid');
const db               = require('../db');
const { validateEvent } = require('../middleware/validate');
const { processEvent } = require('../intent/fitEngine');

const router = express.Router();

router.post('/', validateEvent, async (req, res) => {
  const {
    event_type,
    timestamp,
    session_id,
    anonymous_user_id,
    shop_domain,
    shopify_customer_id,  // optional
    is_new_user,
    page_url,
    page_type,
    product_id,
    variant_id,
    element_text,
    element_type,
    metadata,
  } = req.body;

  // Acquire a dedicated client so all DB operations share one transaction
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // ── 1. UPSERT SHOP ─────────────────────────────────────────
    // Ensures referential integrity for sessions.shop_domain FK.
    // On conflict: no-op (shop already registered).
    await client.query(
      `INSERT INTO shops (shop_domain)
       VALUES ($1)
       ON CONFLICT (shop_domain) DO NOTHING`,
      [shop_domain]
    );

    // ── 2. UPSERT SESSION ───────────────────────────────────────
    // First event for a session creates the row (started_at = NOW).
    // Subsequent events update last_active_at and enrich page context
    // if the values were initially unknown (COALESCE keeps first non-null).
    await client.query(
      `INSERT INTO sessions
         (session_id, anonymous_user_id, shop_domain, shopify_customer_id,
          is_new_user, page_type, product_id, variant_id,
          started_at, last_active_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       ON CONFLICT (session_id) DO UPDATE SET
         last_active_at      = NOW(),
         shopify_customer_id = COALESCE(
           sessions.shopify_customer_id,
           EXCLUDED.shopify_customer_id
         ),
         page_type  = COALESCE(sessions.page_type,  EXCLUDED.page_type),
         product_id = COALESCE(sessions.product_id, EXCLUDED.product_id),
         variant_id = COALESCE(sessions.variant_id, EXCLUDED.variant_id)`,
      [
        session_id,
        anonymous_user_id,
        shop_domain,
        shopify_customer_id || null,
        is_new_user,
        page_type   || null,
        product_id  || null,
        variant_id  || null,
      ]
    );

    // ── 3. INSERT RAW EVENT ─────────────────────────────────────
    // Immutable record. Never updated after insert.
    const rawEventId = uuidv4();

    await client.query(
      `INSERT INTO raw_events
         (id, session_id, anonymous_user_id, shop_domain, event_type,
          timestamp, page_url, page_type, product_id,
          element_text, element_type, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        rawEventId,
        session_id,
        anonymous_user_id,
        shop_domain,
        event_type,
        timestamp,
        page_url     || null,
        page_type    || null,
        product_id   || null,
        element_text || null,
        element_type || null,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );

    // ── 4. RUN INTENT PIPELINE ──────────────────────────────────
    // Passes the transaction client — fitEngine participates in
    // the same transaction and will be rolled back on any error.
    await processEvent(req.body, rawEventId, client);

    // ── 5. COMMIT ───────────────────────────────────────────────
    await client.query('COMMIT');

    return res.status(200).json({ status: 'ok' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[POST /api/events] Pipeline error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });

  } finally {
    client.release();
  }
});

module.exports = router;
