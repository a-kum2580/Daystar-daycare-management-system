const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const { 
  getAllChildren, 
  getChildById, 
  createChild, 
  updateChild, 
  deleteChild,
  assignBabysitter,
  unassignBabysitter,
  getChildBabysitters,
  getChildAttendance,
  addChildAttendance
} = require('../controllers/children.controller');

// @route   GET /api/children
// @desc    Get all children
// @access  Private (Admin/Manager only)
router.get(
  '/',
  protect,
  (req, res, next) => {
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }
    next();
  },
  getAllChildren
);

// @route   GET /api/children/:id
// @desc    Get child by ID
// @access  Private (Admin/Manager/Assigned Babysitter)
router.get(
  '/:id',
  protect,
  getChildById
);

// @route   POST /api/children
// @desc    Create a new child
// @access  Private (Admin/Manager only)
router.post(
  '/',
  protect,
  (req, res, next) => {
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }
    next();
  },
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('dateOfBirth', 'Date of birth is required').not().isEmpty().isDate(),
    check('parentId', 'Parent ID is required').not().isEmpty()
  ],
  createChild
);

// @route   PUT /api/children/:id
// @desc    Update child
// @access  Private (Admin/Manager only)
router.put(
  '/:id',
  protect,
  (req, res, next) => {
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }
    next();
  },
  [
    check('firstName', 'First name is required').optional().not().isEmpty(),
    check('lastName', 'Last name is required').optional().not().isEmpty(),
    check('dateOfBirth', 'Date of birth must be a valid date').optional().isDate(),
    check('allergies', 'Allergies must be an array').optional().isArray(),
    check('emergencyContact', 'Emergency contact must be a valid phone number').optional().isMobilePhone()
  ],
  updateChild
);

// @route   DELETE /api/children/:id
// @desc    Delete child
// @access  Private (Admin only)
router.delete(
  '/:id',
  protect,
  (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }
    next();
  },
  deleteChild
);

// @route   GET /api/children/:id/attendance
// @desc    Get child attendance
// @access  Private (Admin/Manager/Parent)
router.get(
  '/:id/attendance',
  protect,
  getChildAttendance
);

// @route   POST /api/children/:id/attendance
// @desc    Add attendance for a child
// @access  Private (Admin/Manager/Babysitter)
router.post(
  '/:id/attendance',
  protect,
  (req, res, next) => {
    if (!['admin', 'manager', 'babysitter'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }
    next();
  },
  [
    check('date', 'Date is required').not().isEmpty().isDate(),
    check('status', 'Status is required').not().isEmpty().isIn(['present', 'absent', 'late'])
  ],
  addChildAttendance
);

// @route   GET /api/children/:id/babysitters
// @desc    Get babysitters assigned to a child
// @access  Private (Admin/Manager/Parent)
router.get(
  '/:id/babysitters',
  protect,
  (req, res, next) => {
    if (!['admin', 'manager', 'parent'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }
    next();
  },
  getChildBabysitters
);

// @route   POST /api/children/:id/babysitters
// @desc    Assign babysitter to a child
// @access  Private (Admin/Manager only)
router.post(
  '/:id/babysitters',
  protect,
  (req, res, next) => {
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }
    next();
  },
  [
    check('babysitterId', 'Babysitter ID is required').not().isEmpty()
  ],
  assignBabysitter
);

// @route   DELETE /api/children/:id/babysitters/:babysitterId
// @desc    Remove babysitter assignment from a child
// @access  Private (Admin/Manager only)
router.delete(
  '/:id/babysitters/:babysitterId',
  protect,
  (req, res, next) => {
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }
    next();
  },
  unassignBabysitter
);

module.exports = router; 