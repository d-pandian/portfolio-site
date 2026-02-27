// ============================================================
// SCROLL DETECTOR
// Tracks scroll depth (%) and time on page.
// Fires once per threshold per session — not on every scroll event.
//
// Thresholds: 25%, 50%, 75%, 80%
// The backend only scores 80% + >=120s as HIGH_ENGAGEMENT.
// Lower thresholds are sent anyway — backend ignores them (no matching rule).
// Sending them keeps raw data complete for future scoring changes.
//
// Performance: uses requestAnimationFrame to throttle DOM reads.
// The scroll listener itself is passive (never blocks scrolling).
// ============================================================

const THRESHOLDS = [25, 50, 75, 80]; // percent

/**
 * Returns current scroll percentage (0–100).
 * Accounts for fractional pixel rounding via Math.min cap at 100.
 */
function getScrollPct() {
  const el          = document.documentElement;
  const scrollTop   = window.scrollY || el.scrollTop;
  const scrollable  = el.scrollHeight - el.clientHeight;
  if (scrollable <= 0) return 0;
  return Math.min(100, Math.round((scrollTop / scrollable) * 100));
}

/**
 * @param {Object} state  - Shared SDK state (read-only)
 * @param {Function} send - send(eventData) injected from index.js
 */
export function attachScrollDetector(state, send) {
  const fired        = new Set();            // thresholds already fired this session
  const pageLoadTime = Date.now();           // reference point for time_on_page
  let   rafPending   = false;               // prevents queuing multiple rAF calls

  function check() {
    rafPending = false;

    const pct        = getScrollPct();
    const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000); // seconds

    for (const threshold of THRESHOLDS) {
      if (pct >= threshold && !fired.has(threshold)) {
        fired.add(threshold);
        send({
          event_type:   'scroll',
          element_text: null,
          element_type: null,
          metadata: {
            scroll_pct:   threshold,
            time_on_page: timeOnPage,
          },
        });
      }
    }
  }

  window.addEventListener('scroll', function () {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(check);
  }, { passive: true });
}
