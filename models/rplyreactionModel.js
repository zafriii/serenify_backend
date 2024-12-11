const mongoose = require('mongoose');

const replyreactionSchema = new mongoose.Schema({
  reply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['like'], // Define the allowed reaction types
    required: true,
  },
}, { timestamps: true });

const Replyreaction = mongoose.model('Replyreaction', replyreactionSchema);

module.exports = Replyreaction;