const { v4: uuidv4 } = require('uuid');
const storage = require('../storage');

exports.getAllPlaylists = (req, res) => {
  const playlists = Array.from(storage.playlists.values()).map(playlist => ({
    ...playlist,
    songs: playlist.songIds.map(songId => storage.songs.get(songId)).filter(Boolean),
  }));

  res.json({
    success: true,
    data: playlists,
    count: playlists.length,
  });
};

exports.getPlaylistById = (req, res) => {
  const { id } = req.params;
  const playlist = storage.playlists.get(id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: `Playlist with id ${id} not found`,
    });
  }

  const songs = playlist.songIds
    .map(songId => storage.songs.get(songId))
    .filter(Boolean);

  res.json({
    success: true,
    data: {
      ...playlist,
      songs,
    },
  });
};

exports.createPlaylist = (req, res) => {
  const { name, description, songIds } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'name is required',
    });
  }

  // Validate that all songs exist
  const validSongIds = songIds && songIds.length > 0 ? songIds : [];
  for (const songId of validSongIds) {
    if (!storage.songs.has(songId)) {
      return res.status(400).json({
        success: false,
        error: `Song with id ${songId} not found`,
      });
    }
  }

  const playlist = {
    id: uuidv4(),
    name,
    description: description || '',
    songIds: validSongIds,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  storage.playlists.set(playlist.id, playlist);

  const songs = playlist.songIds
    .map(songId => storage.songs.get(songId))
    .filter(Boolean);

  res.status(201).json({
    success: true,
    data: {
      ...playlist,
      songs,
    },
    message: 'Playlist created successfully',
  });
};

exports.updatePlaylist = (req, res) => {
  const { id } = req.params;
  const playlist = storage.playlists.get(id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: `Playlist with id ${id} not found`,
    });
  }

  const { name, description, songIds } = req.body;

  if (name) playlist.name = name;
  if (description !== undefined) playlist.description = description;
  if (songIds) {
    for (const songId of songIds) {
      if (!storage.songs.has(songId)) {
        return res.status(400).json({
          success: false,
          error: `Song with id ${songId} not found`,
        });
      }
    }
    playlist.songIds = songIds;
  }

  playlist.updatedAt = new Date();
  storage.playlists.set(id, playlist);

  const songs = playlist.songIds
    .map(songId => storage.songs.get(songId))
    .filter(Boolean);

  res.json({
    success: true,
    data: {
      ...playlist,
      songs,
    },
    message: 'Playlist updated successfully',
  });
};

exports.deletePlaylist = (req, res) => {
  const { id } = req.params;
  const playlist = storage.playlists.get(id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: `Playlist with id ${id} not found`,
    });
  }

  storage.playlists.delete(id);

  res.json({
    success: true,
    message: 'Playlist deleted successfully',
  });
};

exports.addSongToPlaylist = (req, res) => {
  const { id } = req.params;
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({
      success: false,
      error: 'songId is required',
    });
  }

  const playlist = storage.playlists.get(id);
  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: `Playlist with id ${id} not found`,
    });
  }

  if (!storage.songs.has(songId)) {
    return res.status(404).json({
      success: false,
      error: `Song with id ${songId} not found`,
    });
  }

  if (playlist.songIds.includes(songId)) {
    return res.status(400).json({
      success: false,
      error: 'Song already exists in playlist',
    });
  }

  playlist.songIds.push(songId);
  playlist.updatedAt = new Date();

  const songs = playlist.songIds
    .map(id => storage.songs.get(id))
    .filter(Boolean);

  res.json({
    success: true,
    data: {
      ...playlist,
      songs,
    },
    message: 'Song added to playlist successfully',
  });
};

exports.removeSongFromPlaylist = (req, res) => {
  const { id } = req.params;
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({
      success: false,
      error: 'songId is required',
    });
  }

  const playlist = storage.playlists.get(id);
  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: `Playlist with id ${id} not found`,
    });
  }

  const index = playlist.songIds.indexOf(songId);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Song with id ${songId} not found in playlist`,
    });
  }

  playlist.songIds.splice(index, 1);
  playlist.updatedAt = new Date();

  const songs = playlist.songIds
    .map(id => storage.songs.get(id))
    .filter(Boolean);

  res.json({
    success: true,
    data: {
      ...playlist,
      songs,
    },
    message: 'Song removed from playlist successfully',
  });
};
