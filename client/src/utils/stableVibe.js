let lastVibe = null;
let consecutiveCount = 0;

export function getStableVibe(vibe) {
  if (vibe === lastVibe) {
    consecutiveCount += 1;
  } else {
    lastVibe = vibe;
    consecutiveCount = 1;
  }

  if (consecutiveCount >= 2) {
    return vibe;
  }

  return null;
}
