const express = require('express');
const songController = require('../controllers/songController');

const router = express.Router();

router.get('/', songController.getAllSongs);
router.post('/', songController.createSong);
router.get('/:id', songController.getSongById);
router.put('/:id', songController.updateSong);
router.delete('/:id', songController.deleteSong);

module.exports = router;
