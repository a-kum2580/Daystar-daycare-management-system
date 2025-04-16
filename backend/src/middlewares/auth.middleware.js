const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ROLES } = require('../config/constants');
const { JWT_SECRET } = require('../config/env.config');

const verifyToken = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token') || req.headers.authorization?.split(' ')[1];

  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided, authorization denied' 
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user exists
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is inactive' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    error: 'Access denied. Admin privileges required'
  });
};

const isBabysitter = (req, res, next) => {
  if (req.user && req.user.role === ROLES.BABYSITTER) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    error: 'Access denied. Babysitter privileges required'
  });
};

module.exports = {
  verifyToken,
  isAdmin,
  isBabysitter
}; 