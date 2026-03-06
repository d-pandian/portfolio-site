// ============================================================
// PAGE VIEW DETECTOR
// Fires a single product_view event when the SDK initialises
// on a Shopify product page.
//
// No DOM listeners — fires immediately during init().
// Guard: only fires when pageType === 'product'. Silent on
// collection, cart, home, and other page types.
//
// Rationale: gives the backend a baseline entry event for every
// product page visit, even if the user makes zero interactions.
// Without it, a visitor who lands, reads, and leaves creates
// zero raw_events and never appears in any session feed.
// ============================================================

/**
 * Fires a product_view event immediately if the current page is a product page.
 * Called once during init() — not attached as a DOM listener.
 *
 * @param {Object}   state - Shared SDK state (read-only)
 * @param {Function} send  - send(eventData) injected from index.js
 */
export function fireProductViewIfApplicable(state, send) {
  if (state.pageType !== 'product') return;

  send({
    event_type:   'product_view',
    element_text: null,
    element_type: null,
    metadata: {
      referrer: document.referrer || null,
    },
  });
}
