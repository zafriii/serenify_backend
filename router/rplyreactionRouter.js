const express = require('express');
const { addrplyReaction, removerplyReaction, getrplyReactionsWithCounts } = require('../controllers/rplyreactionController');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

// Add a reaction
router.post('/add', authMiddleware, addrplyReaction);

// Remove a reaction
router.post('/remove', authMiddleware, removerplyReaction);

// Get reactions for a specific post
router.get('/:replyId/replyreactions', getrplyReactionsWithCounts);

module.exports = router;
