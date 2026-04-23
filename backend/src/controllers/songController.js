const { songs } = require('../storage');

function getSongs(req, res) {
  res.json({ success: true, data: songs });
}

function getRandomSongByVibe(req, res) {
  const { vibe } = req.params;
  const normalizedVibe = String(vibe || '').toUpperCase();
  const matches = songs.filter((song) => song.vibe === normalizedVibe);

  if (matches.length === 0) {
    return res.status(404).json({ success: false, error: 'No songs found for that vibe.' });
  }

  const song = matches[Math.floor(Math.random() * matches.length)];
  res.json({ success: true, data: song });
}

module.exports = {
  getSongs,
  getRandomSongByVibe,
};
