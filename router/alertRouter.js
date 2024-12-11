const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middlewares/auth-middleware')


router.get('/', authMiddleware, alertController.getAlerts); // Get all notifications for logged-in user
router.put('/markAsRead', authMiddleware, alertController.markAlertsAsRead); 

module.exports = router;
