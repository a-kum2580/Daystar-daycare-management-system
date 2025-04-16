const { validationResult } = require('express-validator');

/**
 * Middleware to validate request inputs
 * @param {Function} validations - Array of express-validator validations
 * @returns {Function} Middleware function
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Check if any errors occurred
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    // If errors exist, return formatted error response
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

module.exports = {
  validate
}; 