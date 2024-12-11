// routes/reactionRoutes.js
const express = require('express');
const { addcmntReaction, removecmntReaction, getcmntReactionsWithCounts } = require('../controllers/cmntreactionController');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

// Add a reaction
router.post('/add', authMiddleware, addcmntReaction);

// Remove a reaction
router.post('/remove', authMiddleware, removecmntReaction);

// Get reactions for a specific post
router.get('/:commentId/cmntreactions', getcmntReactionsWithCounts);

module.exports = router;
