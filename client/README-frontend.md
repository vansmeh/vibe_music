vibe_music frontend scaffold

This folder contains a minimal React app scaffold for the browser-based AI DJ.

Key parts:
- src/index.js: entry
- src/App.js: router (Home, Player)
- src/pages: Home.jsx, Player.jsx
- src/components: YouTubePlayer, MicInput, VibeMeter
- src/hooks: useMicrophone, useAudioProcessor
- src/services: audioService, vibeService, recommendationService

Notes:
- Services are stubbed for classification and recommendations. Replace with real ML models or API calls.
- The audioService uses the Web Audio API to extract simple features (rms, centroid).
- YouTube player uses an iframe and supports start time via the "start" prop.
