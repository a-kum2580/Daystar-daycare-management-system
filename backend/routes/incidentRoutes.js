const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, incidentController.getAll);
router.get('/:id', authMiddleware, incidentController.getById);
router.get('/child/:childId', authMiddleware, incidentController.getByChild);
router.get('/date/:startDate/:endDate', authMiddleware, incidentController.getByDateRange);
router.post('/', authMiddleware, incidentController.create);
router.put('/:id', authMiddleware, incidentController.update);
router.delete('/:id', authMiddleware, incidentController.delete);

module.exports = router; 