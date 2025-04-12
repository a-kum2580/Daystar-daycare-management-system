const { Parent, Child } = require('../models');

const parentController = {
  async getAll(req, res) {
    try {
      const parents = await Parent.findAll({
        include: [Child]
      });
      res.json(parents);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const parent = await Parent.findByPk(req.params.id, {
        include: [Child]
      });
      if (!parent) {
        return res.status(404).json({ message: 'Parent not found' });
      }
      res.json(parent);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const parent = await Parent.create(req.body);
      res.status(201).json(parent);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const parent = await Parent.findByPk(req.params.id);
      if (!parent) {
        return res.status(404).json({ message: 'Parent not found' });
      }

      await parent.update(req.body);
      res.json(parent);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const parent = await Parent.findByPk(req.params.id);
      if (!parent) {
        return res.status(404).json({ message: 'Parent not found' });
      }

      await parent.destroy();
      res.json({ message: 'Parent deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = parentController; 