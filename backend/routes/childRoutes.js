const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const childController = require('../controllers/childController');
const authMiddleware = require('../middleware/authMiddleware');

// Validation middleware
const childValidation = [
  check('firstName').notEmpty().withMessage('First name is required'),
  check('lastName').notEmpty().withMessage('Last name is required'),
  check('dateOfBirth').isDate().withMessage('Valid date of birth is required'),
  check('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  check('parentId').isInt().withMessage('Valid parent ID is required'),
  check('emergencyContactName').notEmpty().withMessage('Emergency contact name is required'),
  check('emergencyContactPhone').notEmpty().withMessage('Emergency contact phone is required')
];

// Apply auth middleware to all routes
router.use(authMiddleware);

// Child routes
router.get('/', childController.getAllChildren);
router.get('/:id', childController.getChildById);
router.post('/', childValidation, childController.createChild);
router.put('/:id', childValidation, childController.updateChild);
router.delete('/:id', childController.deleteChild);

module.exports = router; 