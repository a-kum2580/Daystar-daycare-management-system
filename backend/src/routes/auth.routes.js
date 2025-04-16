const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, authController.getMe);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (admin only)
 * @access  Private/Admin
 */
router.post(
  '/register',
  [
    protect,
    isAdmin,
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['admin', 'babysitter']),
  ],
  authController.register
);

/**
 * @route   PUT /api/auth/reset-password
 * @desc    Reset user's password (admin only)
 * @access  Private/Admin
 */
router.put(
  '/reset-password',
  [
    protect,
    isAdmin,
    check('userId', 'User ID is required').not().isEmpty(),
    check('newPassword', 'New password must be at least 6 characters long').isLength({ min: 6 }),
  ],
  authController.resetPassword
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change current user's password
 * @access  Private
 */
router.put(
  '/change-password',
  [
    protect,
    check('currentPassword', 'Current password is required').not().isEmpty(),
    check('newPassword', 'New password must be at least 6 characters long').isLength({ min: 6 }),
  ],
  authController.changePassword
);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/users', [protect, isAdmin], authController.getAllUsers);

/**
 * @route   GET /api/auth/users/:id
 * @desc    Get user by ID (admin only)
 * @access  Private/Admin
 */
router.get('/users/:id', [protect, isAdmin], authController.getUserById);

/**
 * @route   PUT /api/auth/toggle-user-status/:id
 * @desc    Activate or deactivate a user (admin only)
 * @access  Private/Admin
 */
router.put('/toggle-user-status/:id', [protect, isAdmin], authController.toggleUserStatus);

module.exports = router; 