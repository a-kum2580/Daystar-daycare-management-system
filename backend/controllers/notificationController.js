const { Notification } = require('../models');

const notificationController = {
  async getAll(req, res) {
    try {
      const notifications = await Notification.findAll();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const notification = await Notification.findByPk(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const notification = await Notification.create(req.body);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const notification = await Notification.findByPk(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      await notification.update(req.body);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const notification = await Notification.findByPk(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      await notification.destroy();
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getByRecipient(req, res) {
    try {
      const { recipientType, recipientId } = req.params;
      const notifications = await Notification.findAll({
        where: {
          recipient_type: recipientType,
          recipient_id: recipientId
        }
      });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async markAsRead(req, res) {
    try {
      const notification = await Notification.findByPk(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      await notification.update({ read: true });
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = notificationController; 