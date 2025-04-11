const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');

// Register route
router.post('/register', registerValidation, AuthController.register);

// Login route
router.post('/login', loginValidation, AuthController.login);

module.exports = router; 