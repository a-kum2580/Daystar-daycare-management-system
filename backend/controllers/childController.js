const { Child, User } = require('../models');
const { validationResult } = require('express-validator');

const childController = {
  // Get all children
  getAllChildren: async (req, res) => {
    try {
      const children = await Child.findAll({
        include: [{
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }]
      });
      res.json(children);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching children', error: error.message });
    }
  },

  // Get a single child by ID
  getChildById: async (req, res) => {
    try {
      const child = await Child.findByPk(req.params.id, {
        include: [{
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }]
      });
      
      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }
      
      res.json(child);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching child', error: error.message });
    }
  },

  // Create a new child
  createChild: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const child = await Child.create(req.body);
      res.status(201).json(child);
    } catch (error) {
      res.status(500).json({ message: 'Error creating child', error: error.message });
    }
  },

  // Update a child
  updateChild: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const child = await Child.findByPk(req.params.id);
      
      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }

      await child.update(req.body);
      res.json(child);
    } catch (error) {
      res.status(500).json({ message: 'Error updating child', error: error.message });
    }
  },

  // Delete a child
  deleteChild: async (req, res) => {
    try {
      const child = await Child.findByPk(req.params.id);
      
      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }

      await child.destroy();
      res.json({ message: 'Child deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting child', error: error.message });
    }
  }
};

module.exports = childController; 