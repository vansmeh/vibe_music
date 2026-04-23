import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page home-page">
      <h1>vibe_music</h1>
      <p>AI DJ in the browser — capture mic input, classify vibe, and get recommendations.</p>
      <div>
        <Link to="/player">Open Player</Link>
      </div>
    </div>
  );
}
