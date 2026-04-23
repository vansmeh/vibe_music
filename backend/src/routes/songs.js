const express = require('express');
const { getSongs, getRandomSongByVibe } = require('../controllers/songController');

const router = express.Router();

router.get('/', getSongs);
router.get('/random/:vibe', getRandomSongByVibe);

module.exports = router;
