// ============================================================
// API CLIENT
// All fetch calls to the Persuaxion backend.
//
// Base URL is read from VITE_API_BASE_URL at build time.
// Defaults to localhost:3000 for local development.
// ============================================================

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * GET /api/dashboard/metrics?shop_domain=...
 * @returns {{ total_pdp_sessions, medium_fit_sessions, strong_plus_fit_sessions,
 *             new_user_sessions, returning_user_sessions }}
 */
export function fetchMetrics(shopDomain) {
  return request(
    `/api/dashboard/metrics?shop_domain=${encodeURIComponent(shopDomain)}`
  );
}

/**
 * GET /api/dashboard/feed?shop_domain=...&page=...&limit=...&confidence=...
 * @returns {{ sessions: [], pagination: {} }}
 */
export function fetchFeed(shopDomain, page = 1, limit = 20, confidence = null) {
  let url = `/api/dashboard/feed?shop_domain=${encodeURIComponent(shopDomain)}&page=${page}&limit=${limit}`;
  if (confidence) url += `&confidence=${encodeURIComponent(confidence)}`;
  return request(url);
}

/**
 * GET /api/sessions/:session_id
 * @returns {{ session, intent_state, signal_breakdown, transition_history, recent_events }}
 */
export function fetchSession(sessionId) {
  return request(`/api/sessions/${encodeURIComponent(sessionId)}`);
}
