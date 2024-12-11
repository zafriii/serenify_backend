const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,  // Associates the note with the logged-in user
  },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
