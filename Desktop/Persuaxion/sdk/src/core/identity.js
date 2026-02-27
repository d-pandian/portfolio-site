// ============================================================
// IDENTITY MODULE
// Manages anonymous_user_id (cookie) and session_id (sessionStorage).
// Determines is_new_user and whether current load is a revisit.
//
// CONTRACT:
//   - No DOM events. No side effects beyond cookie/sessionStorage writes.
//   - Called once at init. Returns plain object.
// ============================================================

const COOKIE_KEY     = '__px_uid';
const SESSION_KEY    = '__px_sid';
const COOKIE_DAYS    = 365;

// ── UUID GENERATION ───────────────────────────────────────────

function generateUUID() {
  // crypto.randomUUID() available in all modern browsers (Chrome 92+, Safari 15.4+, FF 95+)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: RFC 4122 v4 UUID via Math.random (legacy browsers only)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ── COOKIE HELPERS ────────────────────────────────────────────

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // SameSite=Lax: works cross-page within same site, blocks third-party
  document.cookie = name + '=' + encodeURIComponent(value) +
    '; expires=' + expires +
    '; path=/' +
    '; SameSite=Lax';
}

// ── CORE IDENTITY FUNCTIONS ───────────────────────────────────

/**
 * Reads the anonymous_user_id cookie.
 * Creates and writes a new UUID if absent.
 * @returns {{ id: string, existed: boolean }}
 */
function resolveAnonymousUserId() {
  const existing = getCookie(COOKIE_KEY);
  if (existing) {
    return { id: existing, existed: true };
  }
  const newId = generateUUID();
  setCookie(COOKIE_KEY, newId, COOKIE_DAYS);
  return { id: newId, existed: false };
}

/**
 * Reads the session_id from sessionStorage.
 * Creates and writes a new UUID if absent.
 * sessionStorage is per-tab and cleared on tab close — correct session boundary.
 * @returns {{ id: string, isNew: boolean }}
 */
function resolveSessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) {
      return { id: existing, isNew: false };
    }
    const newId = generateUUID();
    sessionStorage.setItem(SESSION_KEY, newId);
    return { id: newId, isNew: true };
  } catch (_e) {
    // sessionStorage blocked (some private browsing modes, iframe sandboxing)
    // Generate an ephemeral ID — won't persist, but won't break the SDK
    return { id: generateUUID(), isNew: true };
  }
}

/**
 * Reads Shopify's customer ID from the Shopify global.
 * Shopify injects window.__st.cid (customer ID) when a customer is logged in.
 * @returns {string|null}
 */
function resolveCustomerId() {
  try {
    // __st is Shopify's analytics object, available on all storefront pages
    const id = window.__st?.cid ?? window.__st?.customer_id;
    return id ? String(id) : null;
  } catch (_e) {
    return null;
  }
}

// ── PUBLIC ────────────────────────────────────────────────────

/**
 * Resolves the full identity state for this SDK load.
 *
 * is_new_user logic (deterministic, matches backend spec):
 *   If shopify_customer_id exists → returning
 *   Else if __px_uid cookie existed → returning
 *   Else → new
 *
 * isRevisit:
 *   True when cookie existed (returning user) AND session is brand new
 *   (user opened a new tab / new browser session).
 *   False if user is continuing an existing session (multiple pages same tab).
 *
 * @returns {{
 *   anonymousUserId: string,
 *   sessionId:       string,
 *   customerId:      string|null,
 *   isNewUser:       boolean,
 *   isRevisit:       boolean
 * }}
 */
export function resolveIdentity() {
  const { id: anonymousUserId, existed: cookieExisted } = resolveAnonymousUserId();
  const { id: sessionId,       isNew:  isNewSession    } = resolveSessionId();
  const customerId = resolveCustomerId();

  // New user: no Shopify login AND cookie did not exist before this load
  const isNewUser = !customerId && !cookieExisted;

  // Revisit: returning user opening a fresh session (new tab / new browser window)
  // NOT fired for every page navigation within the same tab (session continues)
  const isRevisit = !isNewUser && isNewSession;

  return { anonymousUserId, sessionId, customerId, isNewUser, isRevisit };
}
