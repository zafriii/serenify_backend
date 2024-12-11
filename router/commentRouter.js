// routes/commentRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const {
  editComment,
  deleteComment,
} = require('../controllers/commentController');


router.put('/:commentId', authMiddleware, editComment);
router.delete('/:commentId', authMiddleware, deleteComment);

module.exports = router;
