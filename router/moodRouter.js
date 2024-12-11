const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const authMiddleware = require('../middlewares/auth-middleware')

// Route to get all mood records for the day
router.get('/', authMiddleware, moodController.getMoodHistory);

// Route to save a mood record
router.post('/', authMiddleware, moodController.saveMood);

module.exports = router;