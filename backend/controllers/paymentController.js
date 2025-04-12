const { Payment, Parent } = require('../models');

const paymentController = {
  async getAll(req, res) {
    try {
      const payments = await Payment.findAll({
        include: [Parent]
      });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [Parent]
      });
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const payment = await Payment.create(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      await payment.update(req.body);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      await payment.destroy();
      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getByParent(req, res) {
    try {
      const { parentId } = req.params;
      const payments = await Payment.findAll({
        where: {
          parent_id: parentId
        }
      });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = paymentController; 