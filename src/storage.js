// In-memory storage for songs and playlists
const storage = {
  songs: new Map(),
  playlists: new Map(),
};

// Seed initial data
const initializeStorage = () => {
  // Sample songs
  const songs = [
    {
      id: '1',
      title: 'Summer Vibes',
      artist: 'The Beats',
      duration: 180,
      genre: 'Pop',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Electric Dreams',
      artist: 'Synthwave Master',
      duration: 245,
      genre: 'Electronic',
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Midnight Jazz',
      artist: 'Blue Note',
      duration: 210,
      genre: 'Jazz',
      createdAt: new Date(),
    },
  ];

  songs.forEach(song => {
    storage.songs.set(song.id, song);
  });

  // Sample playlist
  const playlist = {
    id: '1',
    name: 'Chill Vibes',
    description: 'Relaxing music for any mood',
    songIds: ['1', '3'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  storage.playlists.set(playlist.id, playlist);
};

initializeStorage();

module.exports = storage;
