const Feedback = require('../models/feedbackModel');

// Handle feedback submission
const submitFeedback = async (req, res) => {
    const { email, content } = req.body;

    try {
        const newFeedback = new Feedback({ email, content });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback.', error });
    }
};

module.exports = {
    submitFeedback,
};
