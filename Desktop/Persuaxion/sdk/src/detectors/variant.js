// ============================================================
// VARIANT DETECTOR
// Detects when the user changes a product variant (size, colour, etc.)
//
// Two listener strategies cover all Shopify theme patterns:
//
//   A. <select> elements  — the traditional dropdown approach
//      Fires on 'change' event.
//      Matches selects whose name/id contains "option" (Shopify convention).
//
//   B. Swatch / radio pickers — modern themes avoid <select>
//      Uses custom data attributes and click-based selection.
//      Delegated click listener + closest() to find the swatch element.
//
// Guards:
//   - Only fires if value actually changed (no duplicate events on re-click)
//   - Updates state.variantId in-place so subsequent events carry
//     the current variant in their payload.
// ============================================================

// Swatch selectors — covers the most common patterns across Shopify themes
const SWATCH_SELECTOR = [
  '[data-option-value]',
  '[data-value]',
  '[data-option-index]',
  '.swatch__input',
  '.variant__button',
  '.color-swatch',
  '[name^="option"]',  // e.g. name="option-0", name="options[Color]"
].join(', ');

/**
 * @param {Object}   state - Shared SDK state. variantId is mutated here.
 * @param {Function} send  - send(eventData) injected from index.js
 */
export function attachVariantDetector(state, send) {
  // Track current variant in closure — initialised from page context
  let currentVariantId = state.variantId;

  /**
   * Fires the variant_change event if the value genuinely changed.
   * Also updates state.variantId so all subsequent event payloads
   * reflect the user's current selection.
   */
  function fireIfChanged(newValue, label) {
    if (!newValue) return;
    if (newValue === currentVariantId) return; // no actual change

    const fromVariant  = currentVariantId;
    currentVariantId   = newValue;
    state.variantId    = newValue; // keep shared state in sync

    send({
      event_type:   'variant_change',
      element_text: label || null,
      element_type: 'variant_selector',
      metadata: {
        variant_id:   newValue,
        from_variant: fromVariant,
      },
    });
  }

  // ── LISTENER A: native <select> ───────────────────────────────
  document.addEventListener('change', function (event) {
    const target = event.target;
    if (!target || target.tagName !== 'SELECT') return;

    // Shopify's variant selects always use "option" in their name or id
    const name = (target.name || '').toLowerCase();
    const id   = (target.id   || '').toLowerCase();
    if (!name.includes('option') && !id.includes('option')) return;

    const selectedOption = target.options[target.selectedIndex];
    const label = selectedOption ? selectedOption.text.trim() : target.value;
    fireIfChanged(target.value, label);

  }, { passive: true });

  // ── LISTENER B: swatch / radio picker ────────────────────────
  // Uses delegated click on document. closest() walks up from the click
  // target to find the nearest swatch element matching SWATCH_SELECTOR.
  document.addEventListener('click', function (event) {
    if (!event.target || !event.target.closest) return;

    const swatch = event.target.closest(SWATCH_SELECTOR);
    if (!swatch) return;

    // Skip plain <select> elements — handled by Listener A
    if (swatch.tagName === 'SELECT') return;

    // Extract the variant value from the most reliable source available
    const value =
      swatch.dataset.optionValue ||
      swatch.dataset.value       ||
      swatch.value               ||
      swatch.getAttribute('value') ||
      (swatch.innerText || swatch.textContent || '').trim();

    const label = (swatch.innerText || swatch.textContent || '').trim() || value;

    fireIfChanged(value, label);

  }, { passive: true });
}
