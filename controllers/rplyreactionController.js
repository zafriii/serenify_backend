const Replyreaction = require('../models/rplyreactionModel');

const Reply = require('../models/replyModel');
const Notification = require('../models/notificationModel');

const Comment = require('../models/commentModel');

const Post = require('../models/postModel');

// Helper function to get reaction counts by type
const getrplyReactionCounts = async (replyId) => {
  const rplyreactions = await Replyreaction.find({ reply: replyId });
  const likeCount = rplyreactions.filter(rplyreaction => rplyreaction.type === 'like').length;

  return { like: likeCount }; // Returning only sad counts
};

// Get reactions and counts for a post
exports.getrplyReactionsWithCounts = async (req, res) => {
  const {replyId} = req.params;

  try {
    // Fetch all reactions for the specified post
    const rplyreactions = await Replyreaction.find({ reply: replyId }).populate('user', 'username');
    
    // Get counts for each reaction type
    const rplyreactionCounts = await getrplyReactionCounts(replyId);
    
    // Respond with both reactions and counts
    res.status(200).json({rplyreactions, rplyreactionCounts });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reactions' });
  }
};

// Add a new reaction

exports.addrplyReaction = async (req, res) => {
  const { replyId } = req.body;
  const userId = req.user.id; // Assuming you're getting user ID from the token

  try {
    const existingRplyReaction = await Replyreaction.findOne({ reply: replyId, user: userId });

    if (existingRplyReaction) {
      // If they already reacted, remove the reaction
      await Replyreaction.findOneAndDelete({ reply: replyId, user: userId });
      const rplyReactionCounts = await getrplyReactionCounts(replyId);
      return res.status(200).json({ message: "Reaction removed", rplyReactionCounts });
    }

    // Create a new reaction
    const newReaction = new Replyreaction({ reply: replyId, user: userId, type: 'like' });
    await newReaction.save();

    // Fetch the reply to get the reply owner and associated post
    const reply = await Reply.findById(replyId).populate('user comment');
    const replyOwner = reply.user._id; // Owner of the reply
    const comment = await Comment.findById(reply.comment).populate('post'); // Populate to get the associated post
    const postId = comment.post._id; // Get the post ID from the comment

    // Notify the reply owner if they’re not the one reacting
    if (replyOwner.toString() !== userId.toString()) {
      const notification = new Notification({
        post: reply.comment.post,
        user: replyOwner,
        postOwner:replyOwner , // Assuming you have access to the post owner
        message: "Someone liked your reply",
        read: false
      });
      await notification.save();
    }

    // Get updated counts for each reaction type
    const rplyreactionCounts = await getrplyReactionCounts(replyId);
    return res.status(200).json({ message: "Reaction added", rplyreactionCounts });
  } catch (error) {
    console.error("Error adding reaction:", error);
    return res.status(500).json({ error: "An error occurred while adding the reaction." });
  }
};


// Remove a reaction
exports.removerplyReaction = async (req, res) => {
  const { replyId } = req.body;
  const userId = req.user.id;

  try {
    const result = await Replyreaction.findOneAndDelete({  reply: replyId, user: userId });
    
    if (!result) {
      return res.status(404).json({ error: "Reaction not found." });
    }

    const rplyreactionCounts = await getrplyReactionCounts(replyId);
    res.status(200).json({ message: "Reaction removed", rplyreactionCounts});
  } catch (error) {
    console.error("Error removing reaction:", error);
    res.status(500).json({ error: error.message });
  }
};
