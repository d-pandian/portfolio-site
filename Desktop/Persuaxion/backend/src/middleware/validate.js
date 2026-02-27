// ============================================================
// REQUEST VALIDATION MIDDLEWARE
// Validates the raw event payload from the JS SDK.
// Fails fast with a specific error message.
// ============================================================

const REQUIRED_FIELDS = [
  'event_type',
  'timestamp',
  'session_id',
  'anonymous_user_id',
  'shop_domain',
];

const VALID_EVENT_TYPES = new Set([
  'click',
  'modal_open',
  'accordion_expand',
  'variant_change',
  'scroll',
  'revisit',
  'exit_intent',
  'chat_open',
  'chat_message',
]);

/**
 * Validates POST /api/events body.
 * Rejects with 400 if any required field is missing or invalid.
 */
function validateEvent(req, res, next) {
  const body = req.body;

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }

  for (const field of REQUIRED_FIELDS) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  if (!VALID_EVENT_TYPES.has(body.event_type)) {
    return res.status(400).json({
      error: `Invalid event_type: "${body.event_type}". ` +
             `Valid types: ${[...VALID_EVENT_TYPES].join(', ')}`,
    });
  }

  if (typeof body.is_new_user !== 'boolean') {
    return res.status(400).json({
      error: 'is_new_user must be a boolean (true or false)',
    });
  }

  // UUID format check for critical identity fields
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(body.session_id)) {
    return res.status(400).json({ error: 'session_id must be a valid UUID v4' });
  }

  if (!uuidPattern.test(body.anonymous_user_id)) {
    return res.status(400).json({ error: 'anonymous_user_id must be a valid UUID v4' });
  }

  next();
}

module.exports = { validateEvent };
