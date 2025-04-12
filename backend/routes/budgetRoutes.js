const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, budgetController.getAll);
router.get('/:id', authMiddleware, budgetController.getById);
router.get('/category/:category', authMiddleware, budgetController.getByCategory);
router.get('/status/:status', authMiddleware, budgetController.getByStatus);
router.post('/', authMiddleware, budgetController.create);
router.put('/:id', authMiddleware, budgetController.update);
router.delete('/:id', authMiddleware, budgetController.delete);

module.exports = router; 