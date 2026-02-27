// ============================================================
// CONFIDENCE TRANSITION LOGIC
// Pure functions. No DB calls. No imports from intent/ or db/.
//
// Rules:
//   - Confidence only moves upward in V1 (no downgrade on score decay)
//   - Transitions are only logged on upward movement
//   - Score ranges are inclusive lower, exclusive upper (except very_strong)
// ============================================================

const { CONFIDENCE_THRESHOLDS } = require('../signals/constants');

const CONFIDENCE_ORDER = ['none', 'medium', 'strong', 'very_strong'];

/**
 * Converts a numeric score to a confidence label.
 * @param {number} score
 * @returns {'none'|'medium'|'strong'|'very_strong'}
 */
function scoreToConfidence(score) {
  if (score >= CONFIDENCE_THRESHOLDS.VERY_STRONG) return 'very_strong';
  if (score >= CONFIDENCE_THRESHOLDS.STRONG)      return 'strong';
  if (score >= CONFIDENCE_THRESHOLDS.MEDIUM)      return 'medium';
  return 'none';
}

/**
 * Returns true if this is an upward confidence transition worth logging.
 * Downward movement (score decay out of window) is intentionally silent in V1.
 * @param {string} fromConfidence
 * @param {string} toConfidence
 * @returns {boolean}
 */
function shouldLogTransition(fromConfidence, toConfidence) {
  const fromIdx = CONFIDENCE_ORDER.indexOf(fromConfidence);
  const toIdx   = CONFIDENCE_ORDER.indexOf(toConfidence);

  // Both must be valid levels, and movement must be upward
  if (fromIdx === -1 || toIdx === -1) return false;
  return toIdx > fromIdx;
}

module.exports = { scoreToConfidence, shouldLogTransition, CONFIDENCE_ORDER };
