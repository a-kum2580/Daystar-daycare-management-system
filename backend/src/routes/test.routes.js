const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   GET /api/test/public
 * @desc    Public test endpoint
 * @access  Public
 */
router.get('/public', (req, res) => {
  res.json({
    success: true,
    message: 'Public endpoint is working',
    data: {
      endpoint: 'public',
      timestamp: new Date()
    }
  });
});

/**
 * @route   GET /api/test/protected
 * @desc    Protected test endpoint (requires authentication)
 * @access  Private
 */
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Protected endpoint is working',
    data: {
      endpoint: 'protected',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      timestamp: new Date()
    }
  });
});

/**
 * @route   GET /api/test/admin
 * @desc    Admin-only test endpoint
 * @access  Private/Admin
 */
router.get('/admin', [verifyToken, isAdmin], (req, res) => {
  res.json({
    success: true,
    message: 'Admin endpoint is working',
    data: {
      endpoint: 'admin',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      timestamp: new Date()
    }
  });
});

/**
 * @route   GET /api/test/error
 * @desc    Error simulation endpoint
 * @access  Public
 */
router.get('/error', (req, res, next) => {
  try {
    // Simulate an error
    throw new Error('This is a simulated error for testing');
  } catch (error) {
    next(error);
  }
});

module.exports = router; 