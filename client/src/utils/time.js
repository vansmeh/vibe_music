export function secondsToYouTubeStart(start) {
  // accepts number or mm:ss string
  if (typeof start === 'number') return Math.max(0, Math.floor(start));
  if (typeof start === 'string') {
    const parts = start.split(':').map((p) => parseInt(p, 10) || 0);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  }
  return 0;
}
