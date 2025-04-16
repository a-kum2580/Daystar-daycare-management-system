const { Babysitter, User, Schedule } = require('../models');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { sendBabysitterCredentials } = require('../services/emailService');
const { generateSecurePassword } = require('../utils/passwordUtils');
const crypto = require('crypto');

// @desc    Get all babysitters
// @route   GET /api/babysitters
// @access  Private (Admin/Manager only)
exports.getAllBabysitters = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: 'babysitter'
      },
      attributes: { exclude: ['password'] }
    });

    // Get all babysitter profiles
    const babysitterProfiles = await Babysitter.findAll({
      where: {
        userId: users.map(user => user.id)
      }
    });

    // Create a map of userId to babysitter profile
    const profileMap = {};
    babysitterProfiles.forEach(profile => {
      profileMap[profile.userId] = profile;
    });

    // Combine user data with babysitter profile data
    const babysitters = users.map(user => {
      const profile = profileMap[user.id] || {};
      return {
        ...user.toJSON(),
        nin: profile.nin,
        dateOfBirth: profile.dateOfBirth,
        nextOfKinName: profile.nextOfKinName,
        nextOfKinPhone: profile.nextOfKinPhone,
        nextOfKinRelationship: profile.nextOfKinRelationship,
        status: profile.status || 'active'
      };
    });

    return res.json({
      success: true,
      count: babysitters.length,
      data: babysitters
    });
  } catch (error) {
    console.error('Error getting babysitters:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get babysitter by ID
// @route   GET /api/babysitters/:id
// @access  Private (Admin/Manager only)
exports.getBabysitterById = async (req, res) => {
  try {
    const babysitter = await User.findOne({
      where: {
        id: req.params.id,
        role: 'babysitter'
      },
      attributes: { exclude: ['password'] }
    });

    if (!babysitter) {
      return res.status(404).json({
        success: false,
        error: 'Babysitter not found'
      });
    }

    return res.json({
      success: true,
      data: babysitter
    });
  } catch (error) {
    console.error('Error getting babysitter:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create a new babysitter
// @route   POST /api/babysitters
// @access  Private (Admin/Manager only)
exports.createBabysitter = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      nin,
      dateOfBirth,
      nextOfKinName,
      nextOfKinPhone,
      nextOfKinRelationship,
      status
    } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Generate a secure password
    const generatedPassword = generateSecurePassword();

    // Create user first
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: await bcrypt.hash(generatedPassword, 10), // Hash the password before saving
      role: 'babysitter',
      isActive: true
    }, { transaction: t });

    // Create babysitter profile
    const babysitter = await Babysitter.create({
      userId: user.id,
      nin,
      dateOfBirth,
      nextOfKinName,
      nextOfKinPhone,
      nextOfKinRelationship,
      status: status || 'active'
    }, { transaction: t });

    let emailSent = true;
    let emailError = null;

    // Send login credentials via email
    try {
      await sendBabysitterCredentials(user, generatedPassword);
    } catch (emailError) {
      console.error('Error sending credentials email:', emailError);
      emailSent = false;
      emailError = emailError.message;
    }

    // Commit the transaction
    await t.commit();

    // Return both user and babysitter data
    const response = {
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        babysitter: {
          id: babysitter.id,
          nin: babysitter.nin,
          dateOfBirth: babysitter.dateOfBirth,
          nextOfKinName: babysitter.nextOfKinName,
          nextOfKinPhone: babysitter.nextOfKinPhone,
          nextOfKinRelationship: babysitter.nextOfKinRelationship,
          status: babysitter.status
        }
      }
    };

    // Include the password in response only if email sending failed
    if (!emailSent) {
      response.emailError = emailError;
      response.temporaryPassword = generatedPassword;
      response.message = 'Babysitter created successfully, but email sending failed. Please note down the temporary password and provide it to the babysitter securely.';
    } else {
      response.message = 'Babysitter created successfully and credentials sent via email.';
    }

    return res.status(201).json(response);
  } catch (error) {
    // Rollback the transaction in case of error
    await t.rollback();
    console.error('Error creating babysitter:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update babysitter
// @route   PUT /api/babysitters/:id
// @access  Private (Admin/Manager only)
exports.updateBabysitter = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, status } = req.body;

    // Find the babysitter
    let babysitter = await User.findOne({
      where: {
        id: req.params.id,
        role: 'babysitter'
      }
    });

    if (!babysitter) {
      return res.status(404).json({
        success: false,
        error: 'Babysitter not found'
      });
    }

    // Check if the email already exists (and it's not the current babysitter)
    if (email && email !== babysitter.email) {
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }
    }

    // Update babysitter
    await babysitter.update({
      firstName: firstName || babysitter.firstName,
      lastName: lastName || babysitter.lastName,
      email: email || babysitter.email,
      phone: phone || babysitter.phone,
      address: address || babysitter.address,
      status: status || babysitter.status
    });

    // Get updated babysitter without password
    babysitter = await User.findOne({
      where: {
        id: req.params.id
      },
      attributes: { exclude: ['password'] }
    });

    return res.json({
      success: true,
      data: babysitter
    });
  } catch (error) {
    console.error('Error updating babysitter:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete babysitter
// @route   DELETE /api/babysitters/:id
// @access  Private (Admin only)
exports.deleteBabysitter = async (req, res) => {
  try {
    const babysitter = await User.findOne({
      where: {
        id: req.params.id,
        role: 'babysitter'
      }
    });

    if (!babysitter) {
      return res.status(404).json({
        success: false,
        error: 'Babysitter not found'
      });
    }

    await babysitter.destroy();

    return res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting babysitter:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get babysitter's schedule
// @route   GET /api/babysitters/:id/schedule
// @access  Private (Admin/Manager/Self)
exports.getBabysitterSchedule = async (req, res) => {
  try {
    // Check if the user is authorized (admin, manager, or the babysitter themselves)
    if (req.user.role !== 'admin' && req.user.role !== 'manager' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    // Find the babysitter to verify they exist
    const babysitter = await User.findOne({
      where: {
        id: req.params.id,
        role: 'babysitter'
      }
    });

    if (!babysitter) {
      return res.status(404).json({
        success: false,
        error: 'Babysitter not found'
      });
    }

    // Get the babysitter's schedule
    const schedule = await Schedule.findAll({
      where: {
        babysitterId: req.params.id
      }
    });

    return res.json({
      success: true,
      count: schedule.length,
      data: schedule
    });
  } catch (error) {
    console.error('Error getting babysitter schedule:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update babysitter's schedule
// @route   PUT /api/babysitters/:id/schedule
// @access  Private (Admin/Manager only)
exports.updateBabysitterSchedule = async (req, res) => {
  try {
    // Find the babysitter to verify they exist
    const babysitter = await User.findOne({
      where: {
        id: req.params.id,
        role: 'babysitter'
      }
    });

    if (!babysitter) {
      return res.status(404).json({
        success: false,
        error: 'Babysitter not found'
      });
    }

    const { scheduleItems } = req.body;

    if (!scheduleItems || !Array.isArray(scheduleItems)) {
      return res.status(400).json({
        success: false,
        error: 'Schedule items are required and must be an array'
      });
    }

    // Clear existing schedule items
    await Schedule.destroy({
      where: {
        babysitterId: req.params.id
      }
    });

    // Create new schedule items
    const createdSchedule = await Schedule.bulkCreate(
      scheduleItems.map(item => ({
        ...item,
        babysitterId: req.params.id
      }))
    );

    return res.json({
      success: true,
      count: createdSchedule.length,
      data: createdSchedule
    });
  } catch (error) {
    console.error('Error updating babysitter schedule:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Reset babysitter's password
// @route   POST /api/babysitters/:id/reset-password
// @access  Private (Admin/Manager only)
exports.resetBabysitterPassword = async (req, res) => {
  try {
    const babysitter = await User.findOne({ 
      _id: req.params.id,
      role: 'babysitter'
    });

    if (!babysitter) {
      return res.status(404).json({
        success: false,
        message: 'Babysitter not found'
      });
    }

    // Generate a new secure password
    const newPassword = crypto.randomBytes(8).toString('hex');
    
    // Update the babysitter's password
    babysitter.password = newPassword;
    await babysitter.save();

    // Send new credentials via email
    try {
      await sendBabysitterCredentials(babysitter.email, newPassword);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Continue with the response even if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successful. New credentials have been sent to the babysitter\'s email.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
}; 