const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, attendanceController.getAll);
router.get('/:id', authMiddleware, attendanceController.getById);
router.get('/date/:date', authMiddleware, attendanceController.getByDate);
router.post('/', authMiddleware, attendanceController.create);
router.put('/:id', authMiddleware, attendanceController.update);
router.delete('/:id', authMiddleware, attendanceController.delete);

module.exports = router; 