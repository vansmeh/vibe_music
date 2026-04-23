const express = require('express');
const { analyzeVibe } = require('../controllers/vibeController');

const router = express.Router();

router.post('/analyze', analyzeVibe);

module.exports = router;
