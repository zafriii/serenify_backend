const Reaction = require('../models/reactionModel');

const Notification = require('../models/notificationModel');

const Post = require('../models/postModel');



// Helper function to get reaction counts by type
const getReactionCounts = async (postId) => {
  const reactions = await Reaction.find({ post: postId });
  const sadCount = reactions.filter(reaction => reaction.type === 'sad').length;

  return { sad: sadCount }; // Returning only sad counts
};

// Get reactions and counts for a post
exports.getReactionsWithCounts = async (req, res) => {
  const { postId } = req.params;

  try {
    // Fetch all reactions for the specified post
    const reactions = await Reaction.find({ post: postId }).populate('user', 'username');
    
    // Get counts for each reaction type
    const reactionCounts = await getReactionCounts(postId);
    
    // Respond with both reactions and counts
    res.status(200).json({ reactions, reactionCounts });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reactions' });
  }
};

 
// Add a new reaction
exports.addReaction = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id; // Assuming you're getting user ID from the token

  try {
    // Check if the user has already reacted on this post
    const existingReaction = await Reaction.findOne({ post: postId, user: userId });

    if (existingReaction) {
      // If they already reacted, remove the reaction
      await Reaction.findOneAndDelete({ post: postId, user: userId });
      const reactionCounts = await getReactionCounts(postId);
      return res.status(200).json({ message: "Reaction removed", reactionCounts });
    }

    // Create a new reaction
    const newReaction = new Reaction({ post: postId, user: userId, type: 'sad' });
    await newReaction.save();



 // Create a notification for the new reaction
 const post = await Post.findById(postId).populate('user');
 if (post.user._id.toString() !== userId.toString()) {
   // Create a notification only if the post owner is not the one reacting
   const notification = new Notification({
     post: postId,
     user: userId,
     postOwner: post.user._id,
     message:"Someone reacted to your post"
   });
   await notification.save();
 }


    // Get updated counts for each reaction type
    const reactionCounts = await getReactionCounts(postId);
    return res.status(200).json({ message: "Reaction added", reactionCounts });
  } catch (error) {
    console.error("Error adding reaction:", error);
    return res.status(500).json({ error: "An error occurred while adding the reaction." });
  }


};

// Remove a reaction
exports.removeReaction = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  try {
    const result = await Reaction.findOneAndDelete({ post: postId, user: userId });
    
    if (!result) {
      return res.status(404).json({ error: "Reaction not found." });
    }

    const reactionCounts = await getReactionCounts(postId);
    res.status(200).json({ message: "Reaction removed", reactionCounts });
  } catch (error) {
    console.error("Error removing reaction:", error);
    res.status(500).json({ error: error.message });
  }
};
