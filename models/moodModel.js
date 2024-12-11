const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    mood: { type: String, required: true, enum: ['happy', 'sad', 'angry', 'depressed', 'frustrated', 'heartbroken'] },
  },
  { timestamps: true } // This will add `createdAt` and `updatedAt` fields automatically
);

const Mood = mongoose.model('Mood', MoodSchema);

module.exports = Mood;
