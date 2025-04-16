const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../config/env.config');

// Middleware to check if user has provided a valid token
exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user by id from decoded token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token is not valid or user no longer exists' 
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        error: 'User account is not active' 
      });
    }

    // Add user data to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ 
      success: false, 
      error: 'Token is not valid' 
    });
  }
}; 