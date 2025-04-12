const { Incident, Child } = require('../models');

const incidentController = {
  async getAll(req, res) {
    try {
      const incidents = await Incident.findAll({
        include: [Child]
      });
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const incident = await Incident.findByPk(req.params.id, {
        include: [Child]
      });
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }
      res.json(incident);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const incident = await Incident.create(req.body);
      res.status(201).json(incident);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const incident = await Incident.findByPk(req.params.id);
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }

      await incident.update(req.body);
      res.json(incident);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const incident = await Incident.findByPk(req.params.id);
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }

      await incident.destroy();
      res.json({ message: 'Incident deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getByChild(req, res) {
    try {
      const { childId } = req.params;
      const incidents = await Incident.findAll({
        where: {
          child_id: childId
        }
      });
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.params;
      const incidents = await Incident.findAll({
        where: {
          date: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = incidentController; 