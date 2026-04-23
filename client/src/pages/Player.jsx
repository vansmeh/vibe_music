import React, { useState, useEffect } from 'react';
import YouTubePlayer from '../components/YouTubePlayer';
import MicInput from '../components/MicInput';
import VibeMeter from '../components/VibeMeter';
import { createAudioProcessor } from '../services/audioService';
import { classifyVibe } from '../services/vibeService';
import { getRecommendations } from '../services/recommendationService';

export default function Player() {
  const [vibe, setVibe] = useState(null);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    if (!vibe) return;
    setRecs(getRecommendations(vibe));
  }, [vibe]);

  const handleAudioData = async (features) => {
    const classified = await classifyVibe(features);
    setVibe(classified);
  };

  return (
    <div className="page player-page">
      <h2>Player</h2>
      <div className="player-grid">
        <section>
          <YouTubePlayer videoId="dQw4w9WgXcQ" start={30} />
        </section>
        <section>
          <MicInput onFeatures={handleAudioData} createProcessor={createAudioProcessor} />
          <VibeMeter vibe={vibe} />
        </section>
        <aside>
          <h3>Recommendations</h3>
          <ul>
            {recs.map((r) => (
              <li key={r.id}>{r.title} — {r.artist}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
