/**
 * Middleware for checking if the user has authorization based on role
 * @param {Array} roles - Array of role names that are authorized for this route
 */
const authorize = (roles) => {
  return (req, res, next) => {
    // Check that user exists and has a role property (should be set by auth middleware)
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Authorization information missing'
      });
    }

    // If roles is not an array, convert it to an array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden - User role '${req.user.role}' is not authorized for this action`
      });
    }

    // User is authorized, proceed to the next middleware or route handler
    next();
  };
};

/**
 * Middleware for checking if the user is an admin
 */
const isAdmin = (req, res, next) => {
  // Check that user exists and has a role property
  if (!req.user || !req.user.role) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden - Authorization information missing'
    });
  }

  // Check if user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden - Admin access required'
    });
  }

  // User is an admin, proceed to the next middleware or route handler
  next();
};

module.exports = {
  authorize,
  isAdmin
}; 