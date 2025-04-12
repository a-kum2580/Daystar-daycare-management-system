const express = require('express');
const router = express.Router();
const babysitterController = require('../controllers/babysitterController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Validation middleware
const babysitterValidation = [
  check('firstName').notEmpty().withMessage('First name is required'),
  check('lastName').notEmpty().withMessage('Last name is required'),
  check('phone').notEmpty().withMessage('Phone number is required'),
  check('nin').notEmpty().withMessage('National ID is required'),
  check('age').isInt({ min: 21, max: 35 }).withMessage('Age must be between 21 and 35'),
  check('nextOfKinContact').notEmpty().withMessage('Next of kin contact is required')
];

// Routes
router.post('/', auth, babysitterValidation, babysitterController.createBabysitter);
router.get('/', auth, babysitterController.getAllBabysitters);
router.get('/:id', auth, babysitterController.getBabysitterById);
router.put('/:id', auth, babysitterValidation, babysitterController.updateBabysitter);
router.delete('/:id', auth, babysitterController.deleteBabysitter);
router.get('/:id/payment/:date', auth, babysitterController.calculateDailyPayment);

module.exports = router; 