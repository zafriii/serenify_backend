// controllers/commentController.js

const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

const Notification = require('../models/notificationModel');


// Create a Comment
const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    // const { postId } = req.params;

    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });

    }

    // const comment = new Comment({
    //   content,
    //   user: req.user._id,
    //   post: postId,
    // });

    // await comment.save();


   // Send notification to the post owner



   const comment = new Comment({
    content,
    user: userId,
    post: postId,
  });

  await comment.save();

  // Create a notification for the post owner if the commenter is not the post owner
  if (post.user._id.toString() !== userId.toString()) {
    const notification = new Notification({
      post: postId,
      user: userId, // ID of the commenter
      postOwner: post.user._id, // ID of the post owner
      message: 'someone commented on your post', 
    });
    await notification.save();
  }
   


    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get All Comments for a Specific Post
const getAllCommentsForPost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username') // Populate comment author's username
      .sort({ createdAt: -1 }); // Sort comments by creation date (newest first)

    const commentCount = comments.length;

    res.status(200).json({ comments, commentCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Edit Comment (only by the comment author)
const editComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: req.user._id },
      { content },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or unauthorized' });
    }

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete Comment (by comment author or post author)


const deleteComment = async (req, res) => { 
  try {
    // Attempt to find and delete the comment by its ID and ensure the user is the comment author
    const comment = await Comment.findOneAndDelete({ _id: req.params.commentId, user: req.user._id });

    // Check if the comment was found and deleted
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or unauthorized' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



module.exports = {
  createComment,
  getAllCommentsForPost,
  editComment,
  deleteComment,
};
