// routes/reactionRoutes.js
const express = require('express');
const { addReaction, removeReaction, getReactionsWithCounts } = require('../controllers/reactionController');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

// Add a reaction
router.post('/add', authMiddleware, addReaction);

// Remove a reaction
router.post('/remove', authMiddleware, removeReaction);

// Get reactions for a specific post
router.get('/:postId/reactions', getReactionsWithCounts);

module.exports = router;
