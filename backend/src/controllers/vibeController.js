const { songs } = require('../storage');

function classifyVibe(features) {
  const energy = Number(features.energy);

  if (!Number.isFinite(energy)) {
    return null;
  }

  if (energy > 0.6) return 'PEAK';
  if (energy > 0.35) return 'BUILD';
  if (energy < 0.2) return 'CHILL';
  return 'FOCUS';
}

function getRandomSongForVibe(vibe) {
  const matches = songs.filter((song) => song.vibe === vibe);
  if (matches.length === 0) return null;
  return matches[Math.floor(Math.random() * matches.length)];
}

function analyzeVibe(req, res) {
  const { energy, centroid, zcr } = req.body;
  const parsedEnergy = Number(energy);

  if (!Number.isFinite(parsedEnergy)) {
    return res.status(400).json({ success: false, error: 'energy must be a number' });
  }

  const vibe = classifyVibe({ energy: parsedEnergy, centroid, zcr });
  const song = getRandomSongForVibe(vibe);

  if (!song) {
    return res.status(500).json({ success: false, error: 'No song available for the analyzed vibe.' });
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${song.youtubeId}&t=${song.startAt}s`;
  res.json({ success: true, data: { vibe, song, youtubeUrl } });
}

module.exports = {
  analyzeVibe,
};
