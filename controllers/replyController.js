const Reply = require('../models/replyModel');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const Notification = require('../models/notificationModel');


const createReply = async (req, res) => {
  try {
    const { content, commentId } = req.body;
    const userId = req.user._id;

    // Check if the comment exists
    const comment = await Comment.findById(commentId).populate('user post'); // Populate user and post fields
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const postId = comment.post._id; // Post ID from the comment
    const commentOwner = comment.user._id; // Owner of the original comment

    // Create the reply
    const reply = new Reply({
      content,
      user: userId,
      comment: commentId,
    });

    await reply.save();

    // Fetch the post to identify the post owner
    const post = await Post.findById(postId).populate('user'); // Populate post's user (post owner)
    const postOwner = post.user._id;

    // Notify the post owner if they’re not the reply author
    if (postOwner.toString() !== userId.toString()) {
      const notification = new Notification({
        post: postId,
        user: userId,
        postOwner: postOwner,
        message: "Someone replied to a comment on your post",
      });
      await notification.save();
    }

    // Notify the comment owner if they are not the reply author and not the post owner
    if (commentOwner.toString() !== userId.toString() && commentOwner.toString() !== postOwner.toString()) {
      const notification = new Notification({
        post: postId,
        user: userId,
        postOwner: commentOwner,
        message: "Someone replied to your comment",
      });
      await notification.save();
    }

    res.status(201).json({ message: 'Reply added successfully', reply });
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const getAllRepliesForComment = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      // Find all replies for the specified comment
      const replies = await Reply.find({ comment: commentId })
        .populate('user', 'username') // Populate reply author's username
        .sort({ createdAt: -1 }); // Sort replies by creation date (newest first)
  
      // Count replies
      const replyCount = replies.length; // Count the number of replies
  
      res.status(200).json({ replies, replyCount }); // Include the reply count in the response
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  


// Edit Reply (only by the reply author)
const editReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { replyId } = req.params;

    const reply = await Reply.findOneAndUpdate(
      { _id: replyId, user: req.user._id },
      { content },
      { new: true }
    );

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found or unauthorized' });
    }

    res.status(200).json({ message: 'Reply updated successfully', reply });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete Reply (only by the reply author)
const deleteReply = async (req, res) => {
  try {
    // Attempt to find and delete the reply by its ID and ensure the user is the reply author
    const reply = await Reply.findOneAndDelete({ _id: req.params.replyId, user: req.user._id });

    // Check if the reply was found and deleted
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found or unauthorized' });
    }

    res.status(200).json({ message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createReply,
  getAllRepliesForComment,
  editReply,
  deleteReply,
};
