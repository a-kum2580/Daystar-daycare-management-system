const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const babysitterController = require('../controllers/babysitter.controller');

// @route   GET /api/babysitters
// @desc    Get all babysitters
// @access  Private (Admin/Manager only)
router.get(
  '/', 
  protect,
  authorize(['admin', 'manager']), 
  babysitterController.getAllBabysitters
);

// @route   GET /api/babysitters/:id
// @desc    Get babysitter by ID
// @access  Private (Admin/Manager only)
router.get(
  '/:id', 
  protect,
  authorize(['admin', 'manager']), 
  babysitterController.getBabysitterById
);

// @route   POST /api/babysitters
// @desc    Create a new babysitter
// @access  Private (Admin/Manager only)
router.post(
  '/',
  protect,
  authorize(['admin', 'manager']),
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  babysitterController.createBabysitter
);

// @route   PUT /api/babysitters/:id
// @desc    Update babysitter
// @access  Private (Admin/Manager only)
router.put(
  '/:id',
  protect,
  authorize(['admin', 'manager']),
  [
    check('firstName', 'First name is required').optional().not().isEmpty(),
    check('lastName', 'Last name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('phone', 'Phone number is required').optional().not().isEmpty(),
    check('status', 'Status must be either active or inactive').optional().isIn(['active', 'inactive'])
  ],
  babysitterController.updateBabysitter
);

// @route   DELETE /api/babysitters/:id
// @desc    Delete babysitter
// @access  Private (Admin only)
router.delete(
  '/:id',
  protect,
  authorize(['admin']),
  babysitterController.deleteBabysitter
);

// @route   GET /api/babysitters/:id/schedule
// @desc    Get babysitter's schedule
// @access  Private (Admin/Manager/Self)
router.get(
  '/:id/schedule',
  protect,
  babysitterController.getBabysitterSchedule
);

// @route   PUT /api/babysitters/:id/schedule
// @desc    Update babysitter's schedule
// @access  Private (Admin/Manager only)
router.put(
  '/:id/schedule',
  protect,
  authorize(['admin', 'manager']),
  babysitterController.updateBabysitterSchedule
);

// @route   POST /api/babysitters/:id/reset-password
// @desc    Reset babysitter's password
// @access  Private (Admin/Manager only)
router.post(
  '/:id/reset-password',
  protect,
  authorize(['admin', 'manager']),
  babysitterController.resetBabysitterPassword
);

module.exports = router; 