// ============================================================
// MODAL + ACCORDION DETECTOR
// Detects modal opens and accordion expansions using MutationObserver.
//
// WHY MutationObserver:
//   Shopify themes use wildly different patterns for modals and drawers.
//   Theme-specific selectors would break on every theme update.
//   DOM observation is the only theme-agnostic approach.
//
// Detects two things:
//   1. Modal open  — new DOM node added matching known modal selectors
//   2. Accordion   — aria-expanded attribute changes false → true
//
// Does NOT classify content. Backend mapper classifies based on
// element_text against the keyword dictionary.
// ============================================================

// Selectors that reliably indicate a modal, drawer, or overlay
const MODAL_SELECTORS = [
  '[role="dialog"]',
  '[aria-modal="true"]',
  '.modal',
  '.modal__overlay',
  '.drawer',
  '.drawer__inner',
  '.popup',
  '.overlay',
  '[data-modal]',
  '[data-drawer]',
  '[data-popup]',
];

/**
 * Extracts the most meaningful text label from a modal/accordion element.
 * Priority: semantic heading → data attribute title → truncated innerText.
 * @param {Element} el
 * @returns {string|null}
 */
function extractLabel(el) {
  try {
    // 1. Semantic heading inside the element
    const heading = el.querySelector(
      'h1, h2, h3, h4, [data-title], [data-heading], ' +
      '.modal__title, .modal-title, .drawer__title, ' +
      '.popup__title, .overlay__title'
    );
    if (heading) {
      const text = (heading.innerText || heading.textContent || '').trim();
      if (text) return text.slice(0, 200);
    }

    // 2. aria-label on the element itself
    const ariaLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    if (ariaLabel && !ariaLabel.match(/^\d+$/)) return ariaLabel.slice(0, 200);

    // 3. Fallback: first 100 chars of visible text
    const fullText = (el.innerText || el.textContent || '').trim();
    return fullText.slice(0, 100) || null;
  } catch (_e) {
    return null;
  }
}

/**
 * Returns true if the element matches any known modal selector.
 * @param {Node} node
 * @returns {boolean}
 */
function isModalNode(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  return MODAL_SELECTORS.some(function (sel) {
    try { return node.matches(sel); } catch (_e) { return false; }
  });
}

/**
 * @param {Object} state  - Shared SDK state (read-only)
 * @param {Function} send - send(eventData) injected from index.js
 */
export function attachModalDetector(state, send) {
  const observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {

      // ── ACCORDION: aria-expanded flips false → true ──────────
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-expanded'
      ) {
        const el = mutation.target;
        // Only fire on expansion (false → true), not collapse
        if (
          el.getAttribute('aria-expanded') === 'true' &&
          mutation.oldValue === 'false'
        ) {
          const label = extractLabel(el);
          send({
            event_type:   'accordion_expand',
            element_text: label,
            element_type: el.tagName.toLowerCase(),
            metadata:     {},
          });
        }
        continue;
      }

      // ── MODAL: new node added to DOM ─────────────────────────
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (!isModalNode(node)) continue;

          // Skip nodes that are visually hidden (display:none, visibility:hidden)
          // A modal "opening" means it becomes visible, not just being in the DOM
          try {
            const style = window.getComputedStyle(node);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
          } catch (_e) {}

          const role  = node.getAttribute('role');
          const label = extractLabel(node);

          send({
            event_type:   'modal_open',
            element_text: label,
            element_type: role || node.tagName.toLowerCase(),
            metadata:     {},
          });
        }
      }
    }
  });

  observer.observe(document.body, {
    childList:          true,
    subtree:            true,
    attributes:         true,
    attributeOldValue:  true,            // needed to compare old aria-expanded value
    attributeFilter:    ['aria-expanded'], // only watch this attribute — reduces noise
  });
}
