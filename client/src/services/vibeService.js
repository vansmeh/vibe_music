// Vibe classification service (stubbed)
// classifyVibe(features) -> "chill" | "energetic" | "neutral"

export async function classifyVibe(features) {
  // Very small heuristic: high rms -> energetic, low -> chill
  const { rms = 0, centroid = 0 } = features || {};
  if (rms > 0.2) return 'energetic';
  if (rms < 0.08) return 'chill';
  return 'neutral';
}

export default { classifyVibe };
