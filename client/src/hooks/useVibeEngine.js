import { useEffect, useRef, useState } from 'react';

const COOLDOWN_MS = 60 * 1000;
let lastSwitchTime = 0;

export function useVibeEngine(stableVibe, onTrackChange) {
  const [activeVibe, setActiveVibe] = useState(null);
  const lastVibeRef = useRef(null);

  useEffect(() => {
    if (!stableVibe) {
      return;
    }

    if (stableVibe === lastVibeRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastSwitchTime < COOLDOWN_MS) {
      return;
    }

    lastVibeRef.current = stableVibe;
    lastSwitchTime = now;
    setActiveVibe(stableVibe);

    if (typeof onTrackChange === 'function') {
      onTrackChange(stableVibe);
    }
  }, [stableVibe, onTrackChange]);

  return activeVibe;
}
