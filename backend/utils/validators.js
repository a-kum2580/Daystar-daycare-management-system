const { body } = require('express-validator');

const validators = {
  // User validation rules
  userValidation: [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],

  // Child validation rules
  childValidation: [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('date_of_birth').isDate().withMessage('Please enter a valid date'),
    body('parent_id').isInt().withMessage('Parent ID must be a number')
  ],

  // Parent validation rules
  parentValidation: [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').matches(/^\+?[\d\s-]+$/).withMessage('Please enter a valid phone number')
  ],

  // Attendance validation rules
  attendanceValidation: [
    body('child_id').isInt().withMessage('Child ID must be a number'),
    body('date').isDate().withMessage('Please enter a valid date'),
    body('status').isIn(['present', 'absent', 'late']).withMessage('Invalid attendance status')
  ],

  // Payment validation rules
  paymentValidation: [
    body('parent_id').isInt().withMessage('Parent ID must be a number'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('payment_date').isDate().withMessage('Please enter a valid date'),
    body('payment_method').isIn(['cash', 'card', 'bank_transfer']).withMessage('Invalid payment method')
  ],

  // Budget validation rules
  budgetValidation: [
    body('category').notEmpty().withMessage('Category is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('date').isDate().withMessage('Please enter a valid date')
  ],

  // Incident validation rules
  incidentValidation: [
    body('child_id').isInt().withMessage('Child ID must be a number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').isDate().withMessage('Please enter a valid date'),
    body('severity').isIn(['low', 'medium', 'high']).withMessage('Invalid severity level')
  ],

  // Notification validation rules
  notificationValidation: [
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('recipient_type').isIn(['parent', 'babysitter', 'admin', 'all']).withMessage('Invalid recipient type')
  ]
};

module.exports = validators; 