const express = require('express');
const songRoutes = require('./src/routes/songs');
const playlistRoutes = require('./src/routes/playlists');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vibe Music API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Vibe Music API',
    endpoints: {
      songs: '/api/songs',
      playlists: '/api/playlists',
      health: '/api/health',
    },
  });
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Vibe Music API listening on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;
