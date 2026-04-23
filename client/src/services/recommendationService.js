// Recommendation engine service (stubbed)
// getRecommendations(vibe) -> list of track objects

const SAMPLE_TRACKS = [
  { id: '1', title: 'Sunset Vibes', artist: 'DJ Breeze' },
  { id: '2', title: 'Late Night Drive', artist: 'Synthwave' },
  { id: '3', title: 'High Energy', artist: 'Pulse' },
];

export function getRecommendations(vibe = 'neutral') {
  if (vibe === 'energetic') return [SAMPLE_TRACKS[2], SAMPLE_TRACKS[1]];
  if (vibe === 'chill') return [SAMPLE_TRACKS[0], SAMPLE_TRACKS[1]];
  return SAMPLE_TRACKS;
}

export default { getRecommendations };
