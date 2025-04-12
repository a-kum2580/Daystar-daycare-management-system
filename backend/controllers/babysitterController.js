const Babysitter = require('../models/babysitter');
const { validationResult } = require('express-validator');

exports.createBabysitter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const babysitterId = await Babysitter.create(req.body);
    res.status(201).json({ message: 'Babysitter created successfully', id: babysitterId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating babysitter', error: error.message });
  }
};

exports.getAllBabysitters = async (req, res) => {
  try {
    const babysitters = await Babysitter.findAll();
    res.json(babysitters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching babysitters', error: error.message });
  }
};

exports.getBabysitterById = async (req, res) => {
  try {
    const babysitter = await Babysitter.findById(req.params.id);
    if (!babysitter) {
      return res.status(404).json({ message: 'Babysitter not found' });
    }
    res.json(babysitter);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching babysitter', error: error.message });
  }
};

exports.updateBabysitter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await Babysitter.update(req.params.id, req.body);
    res.json({ message: 'Babysitter updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating babysitter', error: error.message });
  }
};

exports.deleteBabysitter = async (req, res) => {
  try {
    await Babysitter.delete(req.params.id);
    res.json({ message: 'Babysitter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting babysitter', error: error.message });
  }
};

exports.calculateDailyPayment = async (req, res) => {
  try {
    const { date } = req.params;
    const payment = await Babysitter.calculateDailyPayment(req.params.id, date);
    res.json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating payment', error: error.message });
  }
}; 