const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
  },
  { timestamps: true }
);

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
