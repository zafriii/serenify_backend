const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, // Email is still required
    },
    content: {
        type: String,
        required: true, // Content is still required
    },
}, { timestamps: true }); // Automatically creates createdAt and updatedAt fields

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
