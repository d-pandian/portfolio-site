// ============================================================
// EXIT INTENT DETECTOR
// Fires exactly once per session when the user shows intent to leave.
//
// Two triggers:
//   Desktop — mouseleave on document with clientY < 0
//             (cursor moving into browser chrome / toward tab bar)
//   Mobile  — visibilitychange to 'hidden'
//             (user switches apps, locks screen, or closes tab on mobile)
//
// WHY sendBeacon:
//   The page may be unloading at the moment this fires.
//   fetch() is cancelled on page unload. navigator.sendBeacon() is not.
//   The send function injected here must be the beacon variant.
//
// Guard: fires MAX ONCE per session. A boolean flag prevents re-firing
// if the user moves the cursor back and out again.
// ============================================================

/**
 * @param {Object}   state      - Shared SDK state (read-only)
 * @param {Function} sendBeacon - sendBeacon(eventData) injected from index.js
 */
export function attachExitDetector(state, sendBeacon) {
  let fired = false;

  function fire(trigger) {
    if (fired) return;
    fired = true;

    sendBeacon({
      event_type:   'exit_intent',
      element_text: null,
      element_type: null,
      metadata: { trigger },
    });
  }

  // ── DESKTOP: cursor exits viewport top ────────────────────────
  // clientY < 0 means cursor moved above the viewport boundary.
  // This is the standard exit intent signal — user moving toward
  // the browser's back button or address bar.
  document.addEventListener('mouseleave', function (event) {
    if (event.clientY < 0) {
      fire('mouseleave');
    }
  });

  // ── MOBILE: page visibility hidden ───────────────────────────
  // Fires when user switches apps, locks screen, or the browser
  // moves the tab to background. Most reliable mobile exit signal.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      fire('visibilitychange');
    }
  });
}
