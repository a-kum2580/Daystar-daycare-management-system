const BabysitterModel = require('../models/babysitterModel');
const UserModel = require('../models/userModel');
const { validationResult } = require('express-validator');

class BabysitterController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        nin,
        dateOfBirth,
        nextOfKinName,
        nextOfKinPhone
      } = req.body;

      // Calculate age
      const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
      if (age < 21 || age > 35) {
        return res.status(400).json({
          success: false,
          message: 'Babysitter must be between 21 and 35 years old'
        });
      }

      // Create user account
      const userId = await UserModel.createUser({
        email,
        password,
        role: 'babysitter'
      });

      // Create babysitter profile
      const babysitterId = await BabysitterModel.createBabysitter(userId, {
        firstName,
        lastName,
        phoneNumber,
        nin,
        dateOfBirth,
        nextOfKinName,
        nextOfKinPhone
      });

      res.status(201).json({
        success: true,
        message: 'Babysitter registered successfully',
        babysitterId
      });

    } catch (error) {
      console.error('Babysitter registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering babysitter'
      });
    }
  }

  static async getAllBabysitters(req, res) {
    try {
      const babysitters = await BabysitterModel.getAllBabysitters();
      res.json({
        success: true,
        data: babysitters
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching babysitters'
      });
    }
  }

  static async getBabysitter(req, res) {
    try {
      const babysitter = await BabysitterModel.getBabysitterById(req.params.id);
      if (!babysitter) {
        return res.status(404).json({
          success: false,
          message: 'Babysitter not found'
        });
      }
      res.json({
        success: true,
        data: babysitter
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching babysitter'
      });
    }
  }

  static async updateBabysitter(req, res) {
    try {
      const updated = await BabysitterModel.updateBabysitter(
        req.params.id,
        req.body
      );
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Babysitter not found'
        });
      }
      res.json({
        success: true,
        message: 'Babysitter updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating babysitter'
      });
    }
  }

  static async deleteBabysitter(req, res) {
    try {
      const deleted = await BabysitterModel.deleteBabysitter(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Babysitter not found'
        });
      }
      res.json({
        success: true,
        message: 'Babysitter deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting babysitter'
      });
    }
  }

  static async calculatePayment(req, res) {
    try {
      const { babysitterId } = req.params;
      const { date } = req.query;

      const payment = await BabysitterModel.calculateDailyPayment(
        babysitterId,
        date || new Date().toISOString().split('T')[0]
      );

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error calculating payment'
      });
    }
  }
}

module.exports = BabysitterController; 