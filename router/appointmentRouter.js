const express = require('express');
const router = express.Router();
const { bookAppointment, getBookingDetails } = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/auth-middleware')

// Route for booking an appointment
router.post('/', authMiddleware, bookAppointment);

router.get('/', authMiddleware, getBookingDetails);



// Export the router
module.exports = router;
