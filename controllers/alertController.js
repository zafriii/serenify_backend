const Alert = require('../models/alertModel'); // Make sure you import the Alert model

// Get alerts for the logged-in user
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user._id, read: false })
      .populate('user', 'username') // Assuming the user field exists on Alert model
      .sort({ createdAt: -1 }); // Sort alerts by creation date in descending order
      
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Mark alerts as read
exports.markAlertsAsRead = async (req, res) => {
  try {
    await Alert.updateMany({ user: req.user._id, read: false }, { read: true });
    res.status(200).json({ message: 'Alerts marked as read' });
  } catch (error) {
    console.error('Error marking alerts as read:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
