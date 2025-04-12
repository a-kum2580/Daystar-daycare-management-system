const { Child, Parent } = require('../models');

const childController = {
  async getAll(req, res) {
    try {
      const children = await Child.findAll({
        include: [Parent]
      });
      res.json(children);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const child = await Child.findByPk(req.params.id, {
        include: [Parent]
      });
      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }
      res.json(child);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const child = await Child.create(req.body);
      res.status(201).json(child);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const child = await Child.findByPk(req.params.id);
      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }

      await child.update(req.body);
      res.json(child);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const child = await Child.findByPk(req.params.id);
      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }

      await child.destroy();
      res.json({ message: 'Child deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = childController; 