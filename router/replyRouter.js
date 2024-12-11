// routes/replyRoutes.js

const express = require('express');
const { createReply, getAllRepliesForComment, editReply, deleteReply } = require('../controllers/replyController');
const authMiddleware = require('../middlewares/auth-middleware');// Assuming you have an auth middleware

const router = express.Router();

// Route to create a reply for a specific comment
router.post('/', authMiddleware, createReply);

// Route to get all replies for a specific comment
router.get('/:commentId', getAllRepliesForComment);

// Route to edit a reply
router.put('/:replyId', authMiddleware, editReply);

// Route to delete a reply
router.delete('/:replyId', authMiddleware, deleteReply);

module.exports = router;
