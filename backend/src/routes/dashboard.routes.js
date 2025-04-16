const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', protect, getDashboardStats);

module.exports = router; 