const Commentreaction = require('../models/cmntreactionModel');

const Comment = require('../models/commentModel');
const Notification = require('../models/notificationModel');
const Post = require('../models/postModel');

// Helper function to get reaction counts by type
const getcmntReactionCounts = async (commentId) => {
  const cmntreactions = await Commentreaction.find({ comment: commentId });
  const likeCount = cmntreactions.filter(cmntreaction => cmntreaction.type === 'like').length;

  return { like: likeCount }; // Returning only sad counts
};

// Get reactions and counts for a post
exports.getcmntReactionsWithCounts = async (req, res) => {
  const {commentId } = req.params;

  try {
    // Fetch all reactions for the specified post
    const cmntreactions = await Commentreaction.find({ comment: commentId }).populate('user', 'username');
    
    // Get counts for each reaction type
    const cmntreactionCounts = await getcmntReactionCounts(commentId);
    
    // Respond with both reactions and counts
    res.status(200).json({cmntreactions,cmntreactionCounts });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reactions' });
  }
};


exports.addcmntReaction = async (req, res) => {
  const { commentId } = req.body;
  const userId = req.user.id; // Assuming you're getting user ID from the token

  try {
    const existingcmntReaction = await Commentreaction.findOne({ comment: commentId, user: userId });

    if (existingcmntReaction) {
      // If they already reacted, remove the reaction
      await Commentreaction.findOneAndDelete({ comment: commentId, user: userId });
      const cmntreactionCounts = await getcmntReactionCounts(commentId);
      return res.status(200).json({ message: "Reaction removed", cmntreactionCounts });
    }

    // Create a new reaction
    const newReaction = new Commentreaction({ comment: commentId, user: userId, type: 'like' });
    await newReaction.save();

    // Fetch the comment to get the comment owner
    const comment = await Comment.findById(commentId).populate('user');
    const commentOwner = comment.user._id;

    // Notify the comment owner if someone else liked the comment
    if (commentOwner.toString() !== userId.toString()) {
      const notification = new Notification({
        user: commentOwner,            // User receiving the notification (comment owner)
        message: "Someone liked your comment",
        post: comment.post,            // Associated post
        postOwner: commentOwner,       // Owner of the comment (commentOwner)
        read: false                    // Notification is initially unread
      });
      await notification.save();
    }

    // Get updated counts for each reaction type
    const cmntreactionCounts = await getcmntReactionCounts(commentId);
    return res.status(200).json({ message: "Reaction added", cmntreactionCounts });
  } catch (error) {
    console.error("Error adding reaction:", error);
    return res.status(500).json({ error: "An error occurred while adding the reaction." });
  }
};


// Remove a reaction
exports.removecmntReaction = async (req, res) => {
  const { commentId } = req.body;
  const userId = req.user.id;

  try {
    const result = await Commentreaction.findOneAndDelete({ comment: commentId, user: userId });
    
    if (!result) {
      return res.status(404).json({ error: "Reaction not found." });
    }

    const cmntreactionCounts = await getcmntReactionCounts(commentId);
    res.status(200).json({ message: "Reaction removed", cmntreactionCounts });
  } catch (error) {
    console.error("Error removing reaction:", error);
    res.status(500).json({ error: error.message });
  }
};
