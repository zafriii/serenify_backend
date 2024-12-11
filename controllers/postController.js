const Post = require('../models/postModel');

// Create Post (Only for the logged-in user)
const createPost = async (req, res) => {
  try {
    const { content } = req.body; // Assuming only content is required; add more fields as needed

    const post = new Post({
      content,
      user: req.user._id, // Associate the post with the logged-in user
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get All Posts (For all users)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    .populate('user', 'username')
    .sort({ createdAt: -1 }); // Fetch all posts and populate user information
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get a Single Post by ID (Only if it belongs to the logged-in user)
const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};



const getPostsByLoggedInUser = async (req, res) => {
  try {
    console.log('User ID:', req.user._id); // Debugging line
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 }); 
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error); // Debugging line
    res.status(500).json({ message: 'Server Error', error });
  }
};



// Update Post (Only if it belongs to the logged-in user)
const updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, 
      { content }, 
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete Post (Only if it belongs to the logged-in user)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByLoggedInUser,
  updatePost,
  deletePost,
};
