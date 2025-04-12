const { Budget } = require('../models');

const budgetController = {
  async getAll(req, res) {
    try {
      const budgets = await Budget.findAll();
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const budget = await Budget.findByPk(req.params.id);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const budget = await Budget.create(req.body);
      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const budget = await Budget.findByPk(req.params.id);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }

      await budget.update(req.body);
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const budget = await Budget.findByPk(req.params.id);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }

      await budget.destroy();
      res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getByCategory(req, res) {
    try {
      const { category } = req.params;
      const budgets = await Budget.findAll({
        where: {
          category: category
        }
      });
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const budgets = await Budget.findAll({
        where: {
          status: status
        }
      });
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = budgetController; 