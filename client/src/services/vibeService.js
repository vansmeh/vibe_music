import { vibeClassifier } from './vibeClassifier';

// classifyVibe(features) -> one of: "party_peak", "social", "chill", "background"
export async function classifyVibe(features) {
  // Expect features: { energy, centroid, zcr }
  return vibeClassifier(features || {});
}

export default { classifyVibe };
