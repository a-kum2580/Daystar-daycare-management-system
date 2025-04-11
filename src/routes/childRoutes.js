const express = require('express');
const router = express.Router();
const Child = require('../models/childModel');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateChildData } = require('../middleware/validation');

// Get all children (admin only)
router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const children = await Child.getAll();
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching children', error: error.message });
  }
});

// Get child by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    res.json(child);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching child', error: error.message });
  }
});

// Get children by parent ID
router.get('/parent/:parentId', authenticateToken, async (req, res) => {
  try {
    const children = await Child.findByParentId(req.params.parentId);
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching children', error: error.message });
  }
});

// Create new child
router.post('/', authenticateToken, validateChildData, async (req, res) => {
  try {
    const childId = await Child.create(req.body);
    const child = await Child.findById(childId);
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ message: 'Error creating child', error: error.message });
  }
});

// Update child
router.put('/:id', authenticateToken, validateChildData, async (req, res) => {
  try {
    const child = await Child.update(req.params.id, req.body);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    res.json(child);
  } catch (error) {
    res.status(500).json({ message: 'Error updating child', error: error.message });
  }
});

// Delete child
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    await Child.delete(req.params.id);
    res.json({ message: 'Child deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting child', error: error.message });
  }
});

module.exports = router; 