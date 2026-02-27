// ============================================================
// SIGNAL CONSTANTS
// All internal signal type identifiers and their base scores.
// This file must never import from intent/ or db/.
// ============================================================

const FIT_SIGNALS = {
  // Primary signals — high score weight
  SIZE_CONTENT_INTERACTION:   'SIZE_CONTENT_INTERACTION',   // +4
  USAGE_CONTENT_INTERACTION:  'USAGE_CONTENT_INTERACTION',  // +3
  REVIEW_FIT_INTERACTION:     'REVIEW_FIT_INTERACTION',     // +4
  RETURN_RISK_CHECK:          'RETURN_RISK_CHECK',          // +2
  VARIANT_EXPLORATION:        'VARIANT_EXPLORATION',        // +2 per event, max 2 counted

  // Supporting signals — low score weight
  HIGH_ENGAGEMENT:            'HIGH_ENGAGEMENT',            // +1
  REVISIT:                    'REVISIT',                    // +1
  EXIT_HESITATION:            'EXIT_HESITATION',            // +1

  // Chat signals — explicit intent
  EXPLICIT_QUERY:             'EXPLICIT_QUERY',             // +5, marks explicit_detected
  QUESTION_INDICATOR:         'QUESTION_INDICATOR',         // +1
};

const SIGNAL_SCORES = {
  SIZE_CONTENT_INTERACTION:  4,
  USAGE_CONTENT_INTERACTION: 3,
  REVIEW_FIT_INTERACTION:    4,
  RETURN_RISK_CHECK:         2,
  VARIANT_EXPLORATION:       2,  // applied per signal; capped at 2 instances in scorer
  HIGH_ENGAGEMENT:           1,
  REVISIT:                   1,
  EXIT_HESITATION:           1,
  EXPLICIT_QUERY:            5,
  QUESTION_INDICATOR:        1,
};

// Maximum number of VARIANT_EXPLORATION signals counted in the rolling window
const VARIANT_EXPLORATION_CAP = 2;

// Rolling window duration in milliseconds
const ROLLING_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// Combo rule window: explicit + primary signal must both be within this window
const COMBO_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// Confidence score thresholds
const CONFIDENCE_THRESHOLDS = {
  MEDIUM:     4,
  STRONG:     7,
  VERY_STRONG: 10,
};

// Minimum score applied by combo rule (explicit + recent primary = at least Strong)
const COMBO_MINIMUM_SCORE = 7;

module.exports = {
  FIT_SIGNALS,
  SIGNAL_SCORES,
  VARIANT_EXPLORATION_CAP,
  ROLLING_WINDOW_MS,
  COMBO_WINDOW_MS,
  CONFIDENCE_THRESHOLDS,
  COMBO_MINIMUM_SCORE,
};
