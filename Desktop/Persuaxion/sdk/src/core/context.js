// ============================================================
// CONTEXT MODULE
// Detects page-level context from Shopify globals and URL.
// All reads are defensive — Shopify globals vary by theme and plan.
//
// CONTRACT:
//   - No DOM events. No writes. Pure reads.
//   - Called once at init. Returns plain object.
//   - Never throws. All access wrapped in try/catch.
// ============================================================

// ── SHOP DOMAIN ───────────────────────────────────────────────

function detectShopDomain() {
  try {
    // window.Shopify.shop is always present on Shopify storefronts
    if (window.Shopify?.shop) return window.Shopify.shop;
  } catch (_e) {}
  return window.location.hostname;
}

// ── PAGE TYPE ─────────────────────────────────────────────────

const URL_PAGE_TYPE_PATTERNS = [
  [/^\/products\/[^/]+/, 'product'],
  [/^\/collections\//,   'collection'],
  [/^\/cart/,            'cart'],
  [/^\/pages\//,         'page'],
  [/^\/blogs\//,         'blog'],
  [/^\/$/, 'home'],
];

function detectPageType() {
  try {
    // Shopify injects window.meta.page.pageType on most themes (Online Store 2.0+)
    if (window.meta?.page?.pageType) return window.meta.page.pageType;

    // ShopifyAnalytics fallback (older themes)
    if (window.ShopifyAnalytics?.meta?.page?.pageType) {
      return window.ShopifyAnalytics.meta.page.pageType;
    }
  } catch (_e) {}

  // URL pattern fallback — works on all themes
  const path = window.location.pathname;
  for (const [pattern, type] of URL_PAGE_TYPE_PATTERNS) {
    if (pattern.test(path)) return type;
  }

  return 'other';
}

// ── PRODUCT ID ────────────────────────────────────────────────

function detectProductId() {
  try {
    // ShopifyAnalytics.meta is the most reliable source across themes
    const id =
      window.ShopifyAnalytics?.meta?.product?.id ??
      window.meta?.product?.id ??
      window.__st?.pid; // legacy fallback

    return id ? String(id) : null;
  } catch (_e) {
    return null;
  }
}

// ── VARIANT ID ────────────────────────────────────────────────

function detectVariantId() {
  try {
    // URL param is the most reliable — updated by Shopify JS when user selects variant
    const params = new URLSearchParams(window.location.search);
    const urlVariant = params.get('variant');
    if (urlVariant) return urlVariant;

    // Shopify globals fallback
    const id =
      window.ShopifyAnalytics?.meta?.selectedVariantId ??
      window.meta?.selectedVariantId;

    return id ? String(id) : null;
  } catch (_e) {
    return null;
  }
}

// ── PUBLIC ────────────────────────────────────────────────────

/**
 * Resolves page context at SDK init time.
 * variantId is the initial value; variant detector updates state.variantId
 * in-place as the user changes selections.
 *
 * @returns {{
 *   shopDomain: string,
 *   pageType:   string,
 *   productId:  string|null,
 *   variantId:  string|null
 * }}
 */
export function resolveContext() {
  return {
    shopDomain: detectShopDomain(),
    pageType:   detectPageType(),
    productId:  detectProductId(),
    variantId:  detectVariantId(),
  };
}
