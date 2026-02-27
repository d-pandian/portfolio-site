// ============================================================
// KEYWORD DETECTION DICTIONARY
// Used by the mapper to classify element_text into signal types.
// All matching is case-insensitive substring match.
// This file must never import from signals/ intent/ or db/.
// ============================================================

const FIT_KEYWORDS = [
  'size', 'fit', 'fits', 'fitting', 'measurement', 'measurements',
  'dimension', 'dimensions', 'sizing', 'size guide', 'size chart',
  'how it fits', 'true to size',
];

const USAGE_KEYWORDS = [
  'how to use', 'how to wear', 'instructions', 'usage', 'care',
  'maintain', 'maintenance', 'works with', 'compatible', 'suitable for',
  'recommended for', 'best for',
];

const RETURN_KEYWORDS = [
  'return', 'returns', 'exchange', 'refund', 'send back',
  'return policy', 'free return', 'easy return',
];

const REVIEW_KEYWORDS = [
  'review', 'reviews', 'rating', 'ratings', 'runs small', 'runs large',
  'true to size', 'fits large', 'fits small', 'customer review',
];

const QUESTION_WORDS = [
  '?', 'which', 'what size', 'how do i know', 'should i',
  'will this fit', 'does this', 'not sure', 'unsure', 'help me choose',
];

/**
 * Returns true if text contains any of the provided keywords.
 * Case-insensitive, substring match.
 * @param {string|null|undefined} text
 * @param {string[]} keywords
 * @returns {boolean}
 */
function containsAny(text, keywords) {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

module.exports = {
  FIT_KEYWORDS,
  USAGE_KEYWORDS,
  RETURN_KEYWORDS,
  REVIEW_KEYWORDS,
  QUESTION_WORDS,
  containsAny,
};
