const express = require('express');
const { submitFeedback } = require('../controllers/feedbackController');

const router = express.Router();

// POST route for submitting feedback
router.post('/', submitFeedback);

module.exports = router;
