const { body } = require('express-validator');

const babysitterValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required'),
  body('phoneNumber')
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Please enter a valid phone number'),
  body('nin')
    .notEmpty()
    .withMessage('National Identification Number is required'),
  body('dateOfBirth')
    .isDate()
    .withMessage('Please enter a valid date of birth'),
  body('nextOfKinName')
    .notEmpty()
    .withMessage('Next of kin name is required'),
  body('nextOfKinPhone')
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Please enter a valid next of kin phone number')
];

module.exports = {
  babysitterValidation
}; 