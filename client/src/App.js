import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';

export default function App() {
  return (
    <div className="app-root">
      <header>
        <nav>
          <Link to="/">Home</Link> | <Link to="/player">Player</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player" element={<Player />} />
        </Routes>
      </main>
    </div>
  );
}
