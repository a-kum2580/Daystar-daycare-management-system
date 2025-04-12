const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, parentController.getAll);
router.get('/:id', authMiddleware, parentController.getById);
router.post('/', authMiddleware, parentController.create);
router.put('/:id', authMiddleware, parentController.update);
router.delete('/:id', authMiddleware, parentController.delete);

module.exports = router; 