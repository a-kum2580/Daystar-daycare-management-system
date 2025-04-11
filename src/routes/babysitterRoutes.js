const express = require('express');
const router = express.Router();
const BabysitterController = require('../controllers/babysitterController');
const { auth, isManager } = require('../middleware/auth');
const { babysitterValidation } = require('../middleware/babysitterValidation');

// Public routes
router.post('/register', babysitterValidation, BabysitterController.register);

// Protected routes (require authentication)
router.use(auth);

// Routes accessible by managers only
router.get('/', isManager, BabysitterController.getAllBabysitters);
router.get('/:id', BabysitterController.getBabysitter);
router.put('/:id', isManager, BabysitterController.updateBabysitter);
router.delete('/:id', isManager, BabysitterController.deleteBabysitter);
router.get('/:babysitterId/payment', isManager, BabysitterController.calculatePayment);

module.exports = router; 