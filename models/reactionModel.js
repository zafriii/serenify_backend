// models/reaction.js
const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['sad'], // Define the allowed reaction types
    required: true,
  },
}, { timestamps: true });

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;
