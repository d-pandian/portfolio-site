// ============================================================
// TRANSPORT MODULE
// Handles all HTTP communication to the backend.
//
// Two send modes:
//   send()       — fetch POST. Used for all regular events.
//   sendBeacon() — navigator.sendBeacon. Used ONLY for exit_intent.
//                  Reason: fetch is cancelled on page unload.
//                  sendBeacon survives tab close / navigation away.
//
// CONTRACT:
//   - All failures are SILENT. Never throw. Never console.error in prod.
//   - No retry logic in V1.
//   - Serialization happens here. Callers pass plain objects.
//   - configure() must be called before send/sendBeacon.
// ============================================================

let _endpoint = '';

/**
 * Sets the backend endpoint. Called once during init.
 * @param {string} endpoint — full URL, e.g. https://api.persuaxion.app/api/events
 */
export function configure(endpoint) {
  _endpoint = endpoint;
}

/**
 * POST event payload to backend via fetch.
 * keepalive: true allows the request to outlive short page navigations
 * (but NOT tab close — use sendBeacon for that).
 * @param {Object} payload
 */
export function send(payload) {
  if (!_endpoint) return;
  try {
    fetch(_endpoint, {
      method:    'POST',
      headers:   { 'Content-Type': 'application/json' },
      body:      JSON.stringify(payload),
      keepalive: true,
    }).catch(function () {}); // swallow network errors silently
  } catch (_e) {
    // fetch unavailable or threw synchronously — silent
  }
}

/**
 * POST event payload to backend via navigator.sendBeacon.
 * Used for exit_intent only. Guaranteed delivery even during page unload.
 * Falls back to fetch if sendBeacon is unavailable.
 * @param {Object} payload
 */
export function sendBeacon(payload) {
  if (!_endpoint) return;
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    if (typeof navigator.sendBeacon === 'function') {
      const queued = navigator.sendBeacon(_endpoint, blob);
      if (queued) return; // successfully queued — done
    }
    // sendBeacon unavailable or returned false (queue full) — fall back to fetch
    send(payload);
  } catch (_e) {
    // silent
  }
}
