/**
 * TensorFlow.js readiness + lightweight keyword pre-classification.
 */
import { PATTERN_KEYWORDS } from '../domain/pattern-keywords.js';

export async function initTensorFlow(tf) {
  await tf.ready();
}

export function preClassifyWithKeywords(text, tfjsReady) {
  if (!tfjsReady || !text.trim()) return null;
  const lower = text.toLowerCase();
  const scores = {};
  for (const [pattern, keywords] of Object.entries(PATTERN_KEYWORDS)) {
    scores[pattern] = keywords.filter((k) => lower.includes(k)).length;
  }
  const sorted = Object.entries(scores)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;
  return sorted.slice(0, 3).map(([p]) => p);
}
