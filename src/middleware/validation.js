const { body, validationResult } = require('express-validator');

// Child validation rules
const validateChildData = [
  body('parent_id').isInt().withMessage('Parent ID must be a valid integer'),
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('date_of_birth').isDate().withMessage('Date of birth must be a valid date'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('allergies').optional().isString(),
  body('special_needs').optional().isString()
];

// Financial record validation rules
const validateFinancialData = [
  body('parent_id').isInt().withMessage('Parent ID must be a valid integer'),
  body('child_id').isInt().withMessage('Child ID must be a valid integer'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('payment_type').isIn(['monthly_fee', 'late_fee', 'special_service', 'other'])
    .withMessage('Invalid payment type'),
  body('status').isIn(['pending', 'paid', 'overdue']).withMessage('Invalid status'),
  body('due_date').isDate().withMessage('Due date must be a valid date'),
  body('notes').optional().isString()
];

// Babysitter validation rules
const validateBabysitterData = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^\+?[\d\s-]{10,}$/).withMessage('Valid phone number is required'),
  body('address').optional().isString(),
  body('experience_years').isInt({ min: 0 }).withMessage('Experience years must be a non-negative integer'),
  body('qualifications').optional().isString(),
  body('hourly_rate').isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('availability').optional().isJSON().withMessage('Availability must be valid JSON')
];

// User validation rules
const validateUserData = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
  body('role').isIn(['admin', 'parent', 'staff']).withMessage('Invalid role')
];

// Parent validation rules
const validateParentData = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('phone').matches(/^\+?[\d\s-]{10,}$/).withMessage('Valid phone number is required'),
  body('address').optional().isString(),
  body('emergency_contact').matches(/^\+?[\d\s-]{10,}$/).withMessage('Valid emergency contact number is required')
];

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateChildData,
  validateFinancialData,
  validateBabysitterData,
  validateUserData,
  validateParentData,
  validate
}; 