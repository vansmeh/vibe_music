export function vibeClassifier(features = {}) {
  const { energy = 0, centroid = 0, zcr = 0 } = features;

  // normalize centroid (assuming 0–8000 Hz range)
  const normCentroid = centroid / 8000;

  // PARTY PEAK
  if (energy > 0.6 && normCentroid > 0.4) {
    return 'party_peak';
  }

  // SOCIAL (talking, mid energy, noisy)
  if (energy > 0.3 && zcr > 0.1) {
    return 'social';
  }

  // CHILL (low energy, smooth)
  if (energy < 0.25) {
    return 'chill';
  }

  // BACKGROUND (default mid state)
  return 'background';
}