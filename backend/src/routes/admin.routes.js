const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const adminController = require('../controllers/admin.controller');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin/Manager only)
router.get('/dashboard', protect, authorize(['admin', 'manager']), adminController.getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', protect, authorize(['admin']), adminController.getAllUsers);

// @route   GET /api/admin/users/count
// @desc    Get user counts by role
// @access  Private (Admin/Manager only)
router.get('/users/count', protect, authorize(['admin', 'manager']), adminController.getUserCounts);

// @route   GET /api/admin/attendance/summary
// @desc    Get attendance summary
// @access  Private (Admin/Manager only)
router.get('/attendance/summary', protect, authorize(['admin', 'manager']), adminController.getAttendanceSummary);

// @route   GET /api/admin/attendance/today
// @desc    Get today's attendance
// @access  Private (Admin/Manager only)
router.get('/attendance/today', protect, authorize(['admin', 'manager']), adminController.getTodayAttendance);

module.exports = router; 