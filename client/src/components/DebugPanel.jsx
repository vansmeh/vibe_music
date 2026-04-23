import React from 'react';

export default function DebugPanel({ features = {}, vibe }) {
  const energy = features.energy ?? features.rms ?? 0;
  const centroid = features.centroid ?? 0;
  const zcr = features.zcr ?? 0;

  return (
    <div className="debug-panel">
      <h4>Debug Panel</h4>
      <div className="debug-row">
        <span>Energy</span>
        <span>{energy.toFixed(3)}</span>
      </div>
      <div className="debug-row">
        <span>Centroid</span>
        <span>{centroid.toFixed(3)}</span>
      </div>
      <div className="debug-row">
        <span>ZCR</span>
        <span>{zcr.toFixed(3)}</span>
      </div>
      <div className="debug-row">
        <span>Vibe</span>
        <span>{vibe || '—'}</span>
      </div>
    </div>
  );
}
