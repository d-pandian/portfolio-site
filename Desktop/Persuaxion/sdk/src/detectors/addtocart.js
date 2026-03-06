// ============================================================
// ADD-TO-CART DETECTOR
// Detects when the user adds a product to the cart.
//
// Two complementary strategies cover all Shopify theme patterns:
//
//   A. form submit on action="/cart/add"
//      Classic Dawn/Debut/Brooklyn themes submit a standard form.
//      The submit event is the most reliable signal for these.
//
//   B. click on recognised ATC button selectors
//      AJAX/headless themes intercept the form submit in JS and
//      never let it bubble. A delegated click listener on known
//      Shopify ATC button patterns catches these.
//
// Debounce: a 2-second guard prevents both strategies from
// firing simultaneously for the same physical user action.
//
// Does NOT attempt to confirm success (no cart API polling).
// The intent signal is the user's action, not the cart response.
// ============================================================

// Selectors covering the most common Shopify theme conventions
const ATC_SELECTORS = [
  '[data-add-to-cart]',
  '[data-button-action="add-to-cart"]',
  '[id="AddToCart"]',
  '[id="add-to-cart"]',
  '.add-to-cart',
  '.btn-addtocart',
  '[name="add"]',
  'button[type="submit"].product-form__submit',   // Dawn theme
  'button[type="submit"].shopify-payment-button',  // Shopify pay button
].join(', ');

const DEBOUNCE_MS = 2000;

/**
 * @param {Object}   state - Shared SDK state (read-only)
 * @param {Function} send  - send(eventData) injected from index.js
 */
export function attachAddToCartDetector(state, send) {
  let lastFiredAt = 0;

  /**
   * Central fire function — enforces debounce and builds the payload.
   * @param {string} label - Button text or trigger source description
   */
  function fire(label) {
    const now = Date.now();
    if (now - lastFiredAt < DEBOUNCE_MS) return;
    lastFiredAt = now;

    send({
      event_type:   'add_to_cart',
      element_text: label || null,
      element_type: 'add_to_cart_button',
      metadata: {
        product_id: state.productId,
        variant_id: state.variantId,
      },
    });
  }

  // ── STRATEGY A: Product form submit ───────────────────────────
  // Classic Shopify themes POST to /cart/add via a standard <form>.
  // Listening on 'submit' catches it before any JS interception.
  document.addEventListener('submit', function (event) {
    const form = event.target;
    if (!form || form.tagName !== 'FORM') return;

    const action = form.getAttribute('action') || '';
    if (!action.includes('/cart/add')) return;

    // Try to find the submit button text for context
    const submitBtn = form.querySelector('[type="submit"]');
    const label = submitBtn
      ? (submitBtn.innerText || submitBtn.textContent || '').trim().slice(0, 100)
      : 'form_submit';

    fire(label);
  }, { passive: true });

  // ── STRATEGY B: ATC button click ──────────────────────────────
  // AJAX themes (e.g. Dawn with sections/ajax-cart.js) intercept
  // the form submit in JavaScript — the submit event never fires.
  // A delegated click listener catches the button press directly.
  document.addEventListener('click', function (event) {
    if (!event.target || !event.target.closest) return;

    const btn = event.target.closest(ATC_SELECTORS);
    if (!btn) return;

    // Skip <input type="hidden"> name="add" (non-interactive elements)
    if (btn.tagName === 'INPUT' && btn.type === 'hidden') return;

    const label = (btn.innerText || btn.textContent || btn.value || '')
      .trim()
      .slice(0, 100);

    fire(label || 'add_to_cart');
  }, { passive: true });
}
