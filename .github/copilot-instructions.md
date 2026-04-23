# Copilot Instructions for vibe_music

## Project Overview

**vibe_music** is a Node.js Express-based REST API for managing songs and playlists. It provides a foundation for a music platform with in-memory storage for rapid development and prototyping.

**Tech Stack:**
- Runtime: Node.js
- Framework: Express.js
- Language: JavaScript
- Storage: In-memory Maps (can be migrated to a database later)

## Project Structure

```
vibe_music/
├── index.js                 # Entry point, Express app setup
├── package.json             # Dependencies: express, uuid
├── src/
│   ├── storage.js           # In-memory data store (songs & playlists Maps)
│   ├── controllers/
│   │   ├── songController.js       # Song CRUD operations
│   │   └── playlistController.js   # Playlist CRUD + song management
│   └── routes/
│       ├── songs.js         # Song endpoints
│       └── playlists.js     # Playlist endpoints
```

## Build, Test & Lint Commands

```bash
npm start              # Run the server (port 3000)
npm run dev           # Run with nodemon (auto-reload on file changes)
npm test              # Run tests (jest)
npm run test:watch    # Run tests in watch mode
npm run lint          # Run eslint
```

## API Endpoints

### Songs
- `GET /api/songs` - Get all songs
- `POST /api/songs` - Create a song (body: {title, artist, duration, genre?})
- `GET /api/songs/:id` - Get a specific song
- `PUT /api/songs/:id` - Update a song
- `DELETE /api/songs/:id` - Delete a song

### Playlists
- `GET /api/playlists` - Get all playlists (includes songs array)
- `POST /api/playlists` - Create a playlist (body: {name, description?, songIds?})
- `GET /api/playlists/:id` - Get a specific playlist with songs
- `PUT /api/playlists/:id` - Update a playlist
- `DELETE /api/playlists/:id` - Delete a playlist
- `POST /api/playlists/:id/songs` - Add song to playlist (body: {songId})
- `DELETE /api/playlists/:id/songs` - Remove song from playlist (body: {songId})

## Storage Architecture

The `src/storage.js` file uses JavaScript Maps for in-memory storage:
- `storage.songs` - Map of song objects keyed by UUID
- `storage.playlists` - Map of playlist objects keyed by UUID

Each song has: `id, title, artist, duration (seconds), genre, createdAt`
Each playlist has: `id, name, description, songIds (array), createdAt, updatedAt`

The storage is initialized with sample data (3 songs, 1 playlist) on app startup.

## Development Conventions

### Controller Pattern
Controllers in `src/controllers/` export functions that:
- Take `(req, res)` parameters
- Return JSON responses with `{ success: boolean, data?: object, message?: string, error?: string }`
- Use standard HTTP status codes (200, 201, 400, 404)
- Validate input and return 400 for bad requests, 404 for not found

### Route Pattern
Routes in `src/routes/` use Express Router and map HTTP methods to controller functions.

### Error Handling
- 404 errors when resources don't exist
- 400 errors for missing/invalid required fields
- Validation checks for referential integrity (e.g., songs must exist before adding to playlist)

### Data Validation
- Required fields are validated in controllers before processing
- Song deletion automatically removes it from all playlists
- Duplicate songs in a playlist are prevented

## When Adding Code

1. **New endpoints:** Add route handler in appropriate controller, then register in routes file
2. **New features:** Check storage.js to understand data structure; add to appropriate Map
3. **Error cases:** Follow existing 400/404 patterns; use descriptive error messages
4. **Testing:** Write tests in test files that mirror the src/ structure
5. **Commits:** Use clear messages describing the feature/fix

## Next Steps

- Migrate to a persistent database (MongoDB, PostgreSQL, etc.)
- Add JWT authentication
- Add user ownership for playlists
- Implement pagination for large datasets
- Add input validation library (joi, zod)
- Set up Docker for consistent deployment

---

**Last updated:** April 23, 2026
