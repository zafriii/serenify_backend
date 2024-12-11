const Notification = require('../models/notificationModel');

// Get notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ postOwner: req.user._id, read: false })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
      
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Mark notifications as read
exports.markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ postOwner: req.user._id, read: false }, { read: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};