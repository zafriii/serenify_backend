const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/auth-middleware')



router.get('/', authMiddleware, notificationController.getNotifications); // Get all notifications for logged-in user
router.put('/markAsRead', authMiddleware, notificationController.markNotificationsAsRead); 

module.exports = router;

