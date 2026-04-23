import React from 'react';

export default function VibeMeter({ vibe }) {
  return (
    <div className="vibe-meter">
      <h4>Current Vibe</h4>
      <div className="vibe-value">{vibe || '—'}</div>
    </div>
  );
}
