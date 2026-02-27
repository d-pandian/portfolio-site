// ============================================================
// SIGNAL MAPPER
// Maps a single raw event to zero or more normalized signals.
//
// CONTRACT:
//   - Pure function. Zero DB calls. Zero side effects.
//   - Does not know about scoring. That is scorer's job.
//   - Returns [] if no rule matches.
//   - One raw event can produce multiple signals (unlikely but possible).
// ============================================================

const { FIT_SIGNALS, SIGNAL_SCORES } = require('./constants');
const {
  FIT_KEYWORDS,
  USAGE_KEYWORDS,
  RETURN_KEYWORDS,
  REVIEW_KEYWORDS,
  QUESTION_WORDS,
  containsAny,
} = require('./keywords');

/**
 * @typedef {Object} MappedSignal
 * @property {string} signalType    - One of FIT_SIGNALS
 * @property {number} scoreValue    - Base score contribution
 * @property {boolean} isExplicit   - True only for EXPLICIT_QUERY
 * @property {Object} metadata      - Audit context (keyword match, element text)
 */

/**
 * Maps a raw event object to an array of MappedSignal.
 * @param {Object} rawEvent
 * @returns {MappedSignal[]}
 */
function mapToSignals(rawEvent) {
  const { event_type, element_text, metadata } = rawEvent;

  // ── 1. CHAT MESSAGE ─────────────────────────────────────────
  // Explicit fit query in chat = strongest possible intent signal.
  // A question without fit keywords = weak supporting signal.
  if (event_type === 'chat_message') {
    if (containsAny(element_text, FIT_KEYWORDS)) {
      return [{
        signalType: FIT_SIGNALS.EXPLICIT_QUERY,
        scoreValue: SIGNAL_SCORES.EXPLICIT_QUERY,
        isExplicit: true,
        metadata: { matched_category: 'fit', element_text },
      }];
    }
    if (containsAny(element_text, QUESTION_WORDS)) {
      return [{
        signalType: FIT_SIGNALS.QUESTION_INDICATOR,
        scoreValue: SIGNAL_SCORES.QUESTION_INDICATOR,
        isExplicit: false,
        metadata: { matched_category: 'question', element_text },
      }];
    }
    return [];
  }

  // ── 2. CONTENT INTERACTIONS ──────────────────────────────────
  // click, modal_open, accordion_expand — keyword-classified.
  // Checked in priority order: fit → usage → returns → reviews.
  // Only one signal per event; first match wins.
  if (['click', 'modal_open', 'accordion_expand'].includes(event_type)) {
    if (containsAny(element_text, FIT_KEYWORDS)) {
      return [{
        signalType: FIT_SIGNALS.SIZE_CONTENT_INTERACTION,
        scoreValue: SIGNAL_SCORES.SIZE_CONTENT_INTERACTION,
        isExplicit: false,
        metadata: { matched_category: 'fit', element_text },
      }];
    }
    if (containsAny(element_text, USAGE_KEYWORDS)) {
      return [{
        signalType: FIT_SIGNALS.USAGE_CONTENT_INTERACTION,
        scoreValue: SIGNAL_SCORES.USAGE_CONTENT_INTERACTION,
        isExplicit: false,
        metadata: { matched_category: 'usage', element_text },
      }];
    }
    if (containsAny(element_text, RETURN_KEYWORDS)) {
      return [{
        signalType: FIT_SIGNALS.RETURN_RISK_CHECK,
        scoreValue: SIGNAL_SCORES.RETURN_RISK_CHECK,
        isExplicit: false,
        metadata: { matched_category: 'return', element_text },
      }];
    }
    if (containsAny(element_text, REVIEW_KEYWORDS)) {
      return [{
        signalType: FIT_SIGNALS.REVIEW_FIT_INTERACTION,
        scoreValue: SIGNAL_SCORES.REVIEW_FIT_INTERACTION,
        isExplicit: false,
        metadata: { matched_category: 'review', element_text },
      }];
    }
    return [];
  }

  // ── 3. VARIANT CHANGE ────────────────────────────────────────
  // Any variant selection = exploration signal.
  // The scorer enforces the cap (max 2 counted), not the mapper.
  if (event_type === 'variant_change') {
    return [{
      signalType: FIT_SIGNALS.VARIANT_EXPLORATION,
      scoreValue: SIGNAL_SCORES.VARIANT_EXPLORATION,
      isExplicit: false,
      metadata: {
        variant_id: metadata?.variant_id ?? null,
        from_variant: metadata?.from_variant ?? null,
      },
    }];
  }

  // ── 4. SCROLL DEPTH + TIME ───────────────────────────────────
  // High engagement = deep scroll AND meaningful time on page.
  // Both thresholds must be met. Prevents false positives on fast scrollers.
  if (event_type === 'scroll') {
    const scrollPct  = metadata?.scroll_pct  ?? 0;
    const timeOnPage = metadata?.time_on_page ?? 0;  // seconds
    if (scrollPct >= 80 && timeOnPage >= 120) {
      return [{
        signalType: FIT_SIGNALS.HIGH_ENGAGEMENT,
        scoreValue: SIGNAL_SCORES.HIGH_ENGAGEMENT,
        isExplicit: false,
        metadata: { scroll_pct: scrollPct, time_on_page: timeOnPage },
      }];
    }
    return [];
  }

  // ── 5. REVISIT ───────────────────────────────────────────────
  if (event_type === 'revisit') {
    return [{
      signalType: FIT_SIGNALS.REVISIT,
      scoreValue: SIGNAL_SCORES.REVISIT,
      isExplicit: false,
      metadata: {},
    }];
  }

  // ── 6. EXIT INTENT ───────────────────────────────────────────
  if (event_type === 'exit_intent') {
    return [{
      signalType: FIT_SIGNALS.EXIT_HESITATION,
      scoreValue: SIGNAL_SCORES.EXIT_HESITATION,
      isExplicit: false,
      metadata: {},
    }];
  }

  // No rule matched
  return [];
}

module.exports = { mapToSignals };
