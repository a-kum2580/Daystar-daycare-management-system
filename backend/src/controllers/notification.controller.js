const { Notification, User } = require('../models');

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread/count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    });

    return res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get recent notifications
// @route   GET /api/notifications/recent
// @access  Private
exports.getRecentNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const notifications = await Notification.findAll({
      where: {
        userId: req.user.id
      },
      order: [['createdAt', 'DESC']],
      limit
    });

    return res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error getting recent notifications:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      {
        where: {
          userId: req.user.id,
          isRead: false
        }
      }
    );

    return res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private (Admin only)
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, userId, link } = req.body;

    // Validate required fields
    if (!title || !message || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, message, and userId'
      });
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || 'info',
      userId,
      link
    });

    return res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 