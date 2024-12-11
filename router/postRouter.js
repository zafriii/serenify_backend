const express = require('express');
const router = express.Router();
const {
  createComment,
  getAllCommentsForPost,
  editComment,
  deleteComment,
} = require('../controllers/commentController');


const { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost, 
  getPostsByLoggedInUser // Import the new controller
} = require('../controllers/postController');
const authMiddleware = require('../middlewares/auth-middleware');

// Routes that require authentication for creating, updating, and deleting posts
router.post('/', authMiddleware, createPost);
router.get('/', getAllPosts); // Public route to get all posts

router.post('/:id/comments', authMiddleware,createComment)
router.get('/:id/comments', getAllCommentsForPost)

router.put('/:id/comments', authMiddleware,editComment)
router.delete('/:id/comments', authMiddleware,deleteComment)

router.get('/:id', getPostById); // Public route to get a single post by ID
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);
// New Route: Get all posts by the logged-in user (requires authentication)
router.post('/myposts', authMiddleware, getPostsByLoggedInUser);

module.exports = router;
