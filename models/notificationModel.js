// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who reacted
    // type: { type: String, required: true }, // Type of reaction (e.g., 'sad')
    postOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Owner of the post

    message:{type:String},

    read: { type: Boolean, default: false }, // Whether the notification has been read
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
