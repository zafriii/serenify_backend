const express = require('express');
const router = express.Router();
const { createNote, getAllNotes, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');
const authMiddleware = require('../middlewares/auth-middleware')

// Routes that require authentication
router.post('/', authMiddleware, createNote);
router.get('/', authMiddleware, getAllNotes);
router.get('/:id', authMiddleware, getNoteById);
router.put('/:id', authMiddleware, updateNote);
router.delete('/:id', authMiddleware, deleteNote);

module.exports = router;
