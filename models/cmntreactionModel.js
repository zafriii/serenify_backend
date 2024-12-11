const mongoose = require('mongoose');

const commentreactionSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
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

const Commentreaction = mongoose.model('Commentreaction', commentreactionSchema);

module.exports = Commentreaction;
