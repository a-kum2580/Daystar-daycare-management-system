const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const notificationController = require('../controllers/notification.controller');

// @route   GET /api/notifications/unread/count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread/count', protect, notificationController.getUnreadCount);

// @route   GET /api/notifications/recent
// @desc    Get recent notifications
// @access  Private
router.get('/recent', protect, notificationController.getRecentNotifications);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, notificationController.markAsRead);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, notificationController.markAllAsRead);

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private (Admin only)
router.post('/', protect, authorize(['admin']), notificationController.createNotification);

module.exports = router; 