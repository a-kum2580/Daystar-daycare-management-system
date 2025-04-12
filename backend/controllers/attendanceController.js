const { Attendance, Child } = require('../models');

const attendanceController = {
  async getAll(req, res) {
    try {
      const attendance = await Attendance.findAll({
        include: [Child]
      });
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const attendance = await Attendance.findByPk(req.params.id, {
        include: [Child]
      });
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const attendance = await Attendance.create(req.body);
      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const attendance = await Attendance.findByPk(req.params.id);
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }

      await attendance.update(req.body);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const attendance = await Attendance.findByPk(req.params.id);
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }

      await attendance.destroy();
      res.json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getByDate(req, res) {
    try {
      const { date } = req.params;
      const attendance = await Attendance.findAll({
        where: {
          date: date
        },
        include: [Child]
      });
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = attendanceController; 