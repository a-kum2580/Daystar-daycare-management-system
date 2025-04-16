const { Child, Attendance, User, ChildBabysitter } = require('../models');
const { validationResult } = require('express-validator');

// @desc    Get all children
// @route   GET /api/children
// @access  Private (Admin/Manager only)
exports.getAllChildren = async (req, res) => {
  try {
    const children = await Child.findAll({
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ]
    });

    return res.json({
      success: true,
      count: children.length,
      data: children
    });
  } catch (error) {
    console.error('Error getting children:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get child by ID
// @route   GET /api/children/:id
// @access  Private (Admin/Manager/Assigned Babysitter/Parent)
exports.getChildById = async (req, res) => {
  try {
    const child = await Child.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: User,
          as: 'babysitters',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
          through: {
            attributes: ['assignedAt', 'status'],
            include: [
              {
                model: User,
                as: 'assigner',
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          }
        }
      ]
    });

    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    // Check if the user is authorized to view this child
    const { role, id } = req.user;
    
    // Admin and manager can see all children
    if (role === 'admin' || role === 'manager') {
      return res.json({
        success: true,
        data: child
      });
    }
    
    // Parent can only see their own children
    if (role === 'parent' && child.parentId === id) {
      return res.json({
        success: true,
        data: child
      });
    }
    
    // Babysitter can only see assigned children
    if (role === 'babysitter') {
      const isAssigned = child.babysitters.some(babysitter => 
        babysitter.id === id && babysitter.ChildBabysitter.status === 'active'
      );
      
      if (isAssigned) {
        return res.json({
          success: true,
          data: child
        });
      }
    }

    // If we get here, the user is not authorized
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this resource'
    });
  } catch (error) {
    console.error('Error getting child:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create a new child
// @route   POST /api/children
// @access  Private (Admin/Manager only)
exports.createChild = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      // Parent Information
      parentFirstName,
      parentLastName,
      parentEmail,
      parentPhone,
      parentAddress,
      parentOccupation,
      parentRelationship,
      parentNotes,
      // Child Information
      allergies,
      medicalNotes,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      specialNeeds,
      medications,
      dietaryRestrictions,
      sessionType
    } = req.body;

    // Create child with parent information
    const child = await Child.create({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      // Parent Information
      parentFirstName,
      parentLastName,
      parentEmail,
      parentPhone,
      parentAddress,
      parentOccupation,
      parentRelationship,
      parentNotes,
      // Child Information
      allergies: allergies || [],
      medicalNotes: medicalNotes || '',
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      specialNeeds: specialNeeds || '',
      medications: medications || '',
      dietaryRestrictions: dietaryRestrictions || '',
      sessionType
    });

    return res.status(201).json({
      success: true,
      data: child
    });
  } catch (error) {
    console.error('Error creating child:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update child
// @route   PUT /api/children/:id
// @access  Private (Admin/Manager only)
exports.updateChild = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      parentId,
      allergies,
      medicalNotes,
      emergencyContact
    } = req.body;

    // Find the child
    let child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    // Check if parent exists if parentId is being updated
    if (parentId && parentId !== child.parentId) {
      const parent = await User.findOne({
        where: {
          id: parentId,
          role: 'parent'
        }
      });

      if (!parent) {
        return res.status(404).json({
          success: false,
          error: 'Parent not found'
        });
      }
    }

    // Update child
    await child.update({
      firstName: firstName || child.firstName,
      lastName: lastName || child.lastName,
      dateOfBirth: dateOfBirth || child.dateOfBirth,
      gender: gender || child.gender,
      parentId: parentId || child.parentId,
      allergies: allergies || child.allergies,
      medicalNotes: medicalNotes || child.medicalNotes,
      emergencyContact: emergencyContact || child.emergencyContact
    });

    // Get updated child with parent info
    child = await Child.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ]
    });

    return res.json({
      success: true,
      data: child
    });
  } catch (error) {
    console.error('Error updating child:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete child
// @route   DELETE /api/children/:id
// @access  Private (Admin only)
exports.deleteChild = async (req, res) => {
  try {
    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    await child.destroy();

    return res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting child:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get child attendance
// @route   GET /api/children/:id/attendance
// @access  Private (Admin/Manager/Parent)
exports.getChildAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await Child.findByPk(id);

    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    // Check if user is authorized (admin, manager, or parent of the child)
    if (!['admin', 'manager'].includes(req.user.role) && 
        (req.user.role === 'parent' && child.parentId !== req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    const attendance = await Attendance.findAll({
      where: { childId: id },
      order: [['date', 'DESC']]
    });

    return res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error in getChildAttendance:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Add attendance for a child
// @route   POST /api/children/:id/attendance
// @access  Private (Admin/Manager/Babysitter)
exports.addChildAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { id } = req.params;
    const { date, status, notes } = req.body;

    const child = await Child.findByPk(id);
    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    // Check if user is authorized (admin, manager, or assigned babysitter)
    if (!['admin', 'manager'].includes(req.user.role)) {
      if (req.user.role === 'babysitter') {
        const assignment = await ChildBabysitter.findOne({
          where: {
            childId: id,
            babysitterId: req.user.id,
            status: 'active'
          }
        });

        if (!assignment) {
          return res.status(403).json({
            success: false,
            error: 'Not authorized to record attendance for this child'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to record attendance'
        });
      }
    }

    // Check if attendance record already exists for this date
    const existingAttendance = await Attendance.findOne({
      where: {
        childId: id,
        date
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        error: 'Attendance record already exists for this date'
      });
    }

    const attendance = await Attendance.create({
      childId: id,
      date,
      status,
      notes: notes || '',
      recordedBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error in addChildAttendance:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get babysitters assigned to a child
// @route   GET /api/children/:id/assignments
// @access  Private (Admin/Manager/Parent)
exports.getChildAssignments = async (req, res) => {
  try {
    // Check if the child exists
    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    // Check authorization
    const { role, id } = req.user;
    if (role !== 'admin' && role !== 'manager' && !(role === 'parent' && child.parentId === id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    // Get assigned babysitters
    const assignments = await ChildBabysitter.findAll({
      where: {
        childId: req.params.id
      },
      include: [
        {
          model: User,
          as: 'babysitter',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ]
    });

    return res.json({
      success: true,
      count: assignments.length,
      data: assignments.map(a => a.babysitter)
    });
  } catch (error) {
    console.error('Error getting child assignments:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Assign babysitter to child
// @route   POST /api/children/:id/babysitters
// @access  Private (Admin/Manager only)
exports.assignBabysitter = async (req, res) => {
  try {
    const { babysitterId } = req.body;
    const childId = req.params.id;

    // Check if child exists
    const child = await Child.findByPk(childId);
    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    // Check if babysitter exists and is a babysitter
    const babysitter = await User.findOne({
      where: {
        id: babysitterId,
        role: 'babysitter'
      }
    });
    if (!babysitter) {
      return res.status(404).json({
        success: false,
        error: 'Babysitter not found'
      });
    }

    // Check if assignment already exists
    const existingAssignment = await ChildBabysitter.findOne({
      where: {
        childId,
        babysitterId
      }
    });

    if (existingAssignment) {
      if (existingAssignment.status === 'active') {
        return res.status(400).json({
          success: false,
          error: 'Babysitter is already assigned to this child'
        });
      } else {
        // Reactivate the assignment
        await existingAssignment.update({
          status: 'active',
          assignedAt: new Date(),
          assignedBy: req.user.id
        });

        return res.json({
          success: true,
          data: existingAssignment
        });
      }
    }

    // Create new assignment
    const assignment = await ChildBabysitter.create({
      childId,
      babysitterId,
      assignedBy: req.user.id,
      status: 'active'
    });

    return res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error assigning babysitter:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Unassign babysitter from child
// @route   DELETE /api/children/:id/babysitters/:babysitterId
// @access  Private (Admin/Manager only)
exports.unassignBabysitter = async (req, res) => {
  try {
    const { id: childId, babysitterId } = req.params;

    const assignment = await ChildBabysitter.findOne({
      where: {
        childId,
        babysitterId,
        status: 'active'
      }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Active assignment not found'
      });
    }

    // Soft delete by setting status to inactive
    await assignment.update({
      status: 'inactive'
    });

    return res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error unassigning babysitter:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get child's babysitter assignments
// @route   GET /api/children/:id/babysitters
// @access  Private (Admin/Manager/Parent)
exports.getChildBabysitters = async (req, res) => {
  try {
    const child = await Child.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'babysitters',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
          through: {
            attributes: ['assignedAt', 'status'],
            include: [
              {
                model: User,
                as: 'assigner',
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          }
        }
      ]
    });

    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    // Check authorization
    const { role, id } = req.user;
    if (role !== 'admin' && role !== 'manager' && !(role === 'parent' && child.parentId === id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    return res.json({
      success: true,
      data: child.babysitters
    });
  } catch (error) {
    console.error('Error getting child babysitters:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get babysitter's assigned children
// @route   GET /api/babysitters/:id/children
// @access  Private (Admin/Manager/Babysitter)
exports.getBabysitterChildren = async (req, res) => {
  try {
    const babysitterId = req.params.id;

    // Check if user exists and is a babysitter
    const babysitter = await User.findOne({
      where: {
        id: babysitterId,
        role: 'babysitter'
      }
    });

    if (!babysitter) {
      return res.status(404).json({
        success: false,
        error: 'Babysitter not found'
      });
    }

    // Check authorization
    const { role, id } = req.user;
    if (role !== 'admin' && role !== 'manager' && role !== 'babysitter' || 
        (role === 'babysitter' && id !== parseInt(babysitterId))) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    const children = await Child.findAll({
      include: [
        {
          model: User,
          as: 'babysitters',
          where: {
            id: babysitterId
          },
          attributes: [],
          through: {
            where: {
              status: 'active'
            },
            attributes: ['assignedAt']
          }
        },
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ]
    });

    return res.json({
      success: true,
      data: children
    });
  } catch (error) {
    console.error('Error getting babysitter children:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 