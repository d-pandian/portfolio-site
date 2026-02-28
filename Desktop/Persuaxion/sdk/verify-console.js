// ============================================================
// PERSUAXION INSTALL VERIFIER
// Paste this entire block into the browser console on any
// Shopify product page after installing the SDK.
// ============================================================

(function verifyPersuaxion() {
  const results = [];
  const BACKEND = 'https://backend-production-2811.up.railway.app';

  // 1. SDK loaded?
  results.push({
    check: 'SDK loaded (window.Persuaxion)',
    pass:  typeof window.Persuaxion !== 'undefined',
    value: typeof window.Persuaxion
  });

  // 2. Identity cookies set?
  const uid = document.cookie.match(/__px_uid=([^;]+)/);
  const sid = sessionStorage.getItem('__px_sid');
  results.push({ check: 'anonymous_user_id cookie (__px_uid)', pass: !!uid, value: uid?.[1]?.slice(0,8) + '…' || 'MISSING' });
  results.push({ check: 'session_id (sessionStorage __px_sid)',  pass: !!sid, value: sid?.slice(0,8) + '…' || 'MISSING' });

  // 3. Shopify globals readable?
  results.push({ check: 'window.Shopify.shop',          pass: !!window.Shopify?.shop,            value: window.Shopify?.shop || 'MISSING' });
  results.push({ check: 'window.meta.page.pageType',    pass: !!window.meta?.page?.pageType,     value: window.meta?.page?.pageType || '(using URL fallback)' });
  results.push({ check: 'window.ShopifyAnalytics.meta', pass: !!window.ShopifyAnalytics?.meta,   value: window.ShopifyAnalytics?.meta ? 'present' : '(absent — ok)' });

  // 4. Fire a test event and check response
  const testPayload = {
    event_type:        'click',
    session_id:        sid || '00000000-0000-4000-8000-000000000001',
    anonymous_user_id: uid?.[1] || '00000000-0000-4000-8000-000000000002',
    shop_domain:       window.Shopify?.shop || window.location.hostname,
    is_new_user:       !uid,
    page_type:         window.meta?.page?.pageType || 'product',
    product_id:        String(window.ShopifyAnalytics?.meta?.product?.id || window.meta?.product?.id || 'verify-test'),
    element_text:      'Persuaxion verify test',
    element_type:      'console',
    timestamp:         new Date().toISOString(),
    metadata:          { source: 'verify-console' }
  };

  console.group('%c PERSUAXION INSTALL CHECK', 'background:#111;color:#10b981;font-weight:bold;padding:2px 8px;border-radius:3px');

  results.forEach(r => {
    const icon = r.pass ? '✅' : '❌';
    console.log(`${icon}  ${r.check}\n    → ${r.value}`);
  });

  console.log('\n%c Firing live test event to Railway…', 'color:#6366f1');
  fetch(BACKEND + '/api/events', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(testPayload),
  })
  .then(r => r.json())
  .then(data => {
    if (data.status === 'ok') {
      console.log('%c ✅ POST /api/events → {"status":"ok"} — PIPELINE IS LIVE', 'color:#10b981;font-weight:bold');
      console.log('   Session will appear in dashboard within seconds.');
      console.log('   Dashboard: https://persuaxion-dashboard.vercel.app');
    } else {
      console.error('❌ Unexpected response:', data);
    }
  })
  .catch(err => {
    console.error('❌ POST failed:', err.message);
    console.log('   Check: is the Railway backend live?', BACKEND + '/health');
  });

  console.groupEnd();
})();
