const { v4: uuidv4 } = require('uuid');
const storage = require('../storage');

exports.getAllSongs = (req, res) => {
  const songs = Array.from(storage.songs.values());
  res.json({
    success: true,
    data: songs,
    count: songs.length,
  });
};

exports.getSongById = (req, res) => {
  const { id } = req.params;
  const song = storage.songs.get(id);

  if (!song) {
    return res.status(404).json({
      success: false,
      error: `Song with id ${id} not found`,
    });
  }

  res.json({
    success: true,
    data: song,
  });
};

exports.createSong = (req, res) => {
  const { title, artist, duration, genre } = req.body;

  if (!title || !artist || !duration) {
    return res.status(400).json({
      success: false,
      error: 'title, artist, and duration are required',
    });
  }

  const song = {
    id: uuidv4(),
    title,
    artist,
    duration: parseInt(duration),
    genre: genre || 'Unknown',
    createdAt: new Date(),
  };

  storage.songs.set(song.id, song);

  res.status(201).json({
    success: true,
    data: song,
    message: 'Song created successfully',
  });
};

exports.updateSong = (req, res) => {
  const { id } = req.params;
  const song = storage.songs.get(id);

  if (!song) {
    return res.status(404).json({
      success: false,
      error: `Song with id ${id} not found`,
    });
  }

  const { title, artist, duration, genre } = req.body;

  if (title) song.title = title;
  if (artist) song.artist = artist;
  if (duration) song.duration = parseInt(duration);
  if (genre) song.genre = genre;

  storage.songs.set(id, song);

  res.json({
    success: true,
    data: song,
    message: 'Song updated successfully',
  });
};

exports.deleteSong = (req, res) => {
  const { id } = req.params;
  const song = storage.songs.get(id);

  if (!song) {
    return res.status(404).json({
      success: false,
      error: `Song with id ${id} not found`,
    });
  }

  storage.songs.delete(id);

  // Remove song from all playlists
  storage.playlists.forEach(playlist => {
    playlist.songIds = playlist.songIds.filter(songId => songId !== id);
  });

  res.json({
    success: true,
    message: 'Song deleted successfully',
  });
};
