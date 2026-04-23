import { vibeClassifier } from './vibeClassifier';
import { getStableVibe } from '../utils/stableVibe';

// classifyVibe(features) -> one of: "party_peak", "social", "chill", "background"
export async function classifyVibe(features) {
  // Expect features: { energy, centroid, zcr }
  const classified = vibeClassifier(features || {});
  return getStableVibe(classified);
}

export default { classifyVibe };
