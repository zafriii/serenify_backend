const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who reacted
    // type: { type: String, required: true }, // Type of reaction (e.g., 'sad')
   
    message:{type:String},

    read: { type: Boolean, default: false }, // Whether the notification has been read
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);