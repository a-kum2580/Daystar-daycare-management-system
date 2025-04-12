const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, paymentController.getAll);
router.get('/:id', authMiddleware, paymentController.getById);
router.get('/parent/:parentId', authMiddleware, paymentController.getByParent);
router.post('/', authMiddleware, paymentController.create);
router.put('/:id', authMiddleware, paymentController.update);
router.delete('/:id', authMiddleware, paymentController.delete);

module.exports = router; 