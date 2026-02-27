// ============================================================
// CLICK DETECTOR
// Captures all meaningful clicks on the page via a single
// delegated listener on document.
//
// Strategy: event delegation — one listener, not per-element binding.
// Reason: Shopify themes add/remove DOM elements dynamically.
//         A delegated listener catches everything regardless of when
//         elements are added.
//
// Does NOT classify. The backend signal mapper classifies based on
// element_text against the keyword dictionary.
// ============================================================

const SKIP_TAGS = new Set(['INPUT', 'SELECT', 'TEXTAREA', 'OPTION', 'SCRIPT', 'STYLE']);
const MAX_TEXT_LEN = 200;

/**
 * Walks up the DOM from the clicked element to find meaningful text.
 * Handles cases where the click target is an icon/img inside a button.
 * @param {EventTarget} target
 * @returns {{ text: string, el: Element }}
 */
function resolveTarget(target) {
  let el = target;
  // Walk up max 3 levels to find an element with text
  // (e.g. user clicks SVG icon inside <a> — we want the <a>'s text)
  for (let i = 0; i < 3; i++) {
    const text = (el.innerText || el.textContent || '').trim();
    if (text) return { text, el };
    if (!el.parentElement) break;
    el = el.parentElement;
  }
  return { text: '', el: target };
}

/**
 * Attaches the click detector.
 * @param {Object} state  - Shared SDK state (read-only in this detector)
 * @param {Function} send - send(eventData) injected from index.js
 */
export function attachClickDetector(state, send) {
  document.addEventListener('click', function (event) {
    const target = event.target;
    if (!target || !target.tagName) return;

    // Skip form input tags — variant detector handles those
    if (SKIP_TAGS.has(target.tagName)) return;

    // Merchant escape hatch: add data-px-ignore to any element to suppress tracking
    if (target.closest && target.closest('[data-px-ignore]')) return;

    const { text, el } = resolveTarget(target);
    if (!text) return;

    const elementText = text.length > MAX_TEXT_LEN ? text.slice(0, MAX_TEXT_LEN) : text;

    // Encode element type: tag + role if present (e.g. "button[dialog]")
    const role = el.getAttribute('role');
    const elementType = role
      ? el.tagName.toLowerCase() + '[' + role + ']'
      : el.tagName.toLowerCase();

    send({
      event_type:   'click',
      element_text: elementText,
      element_type: elementType,
      metadata:     {},
    });
  }, { passive: true });
}
