const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Dashboard routes
router.get('/dashboard', auth, authorize(['admin', 'manager']), getDashboardStats);

module.exports = router; 