const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, childController.getAll);
router.get('/:id', authMiddleware, childController.getById);
router.post('/', authMiddleware, childController.create);
router.put('/:id', authMiddleware, childController.update);
router.delete('/:id', authMiddleware, childController.delete);

module.exports = router; 