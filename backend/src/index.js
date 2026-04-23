const express = require('express');
const cors = require('cors');
const songsRouter = require('./routes/songs');
const vibeRouter = require('./routes/vibe');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/songs', songsRouter);
app.use('/api/vibe', vibeRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Vibe Music backend running' });
});

app.listen(PORT, () => {
  console.log(`Vibe Music backend listening on port ${PORT}`);
});
