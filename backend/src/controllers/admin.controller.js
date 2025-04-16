const { User, Child, Attendance, ChildBabysitter } = require('../models');
const { Sequelize, Op } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin/Manager only)
exports.getDashboardStats = async (req, res) => {
  try {
    // Gather all required statistics in parallel
    const [
      totalChildren,
      totalParents,
      totalBabysitters,
      childrenWithBabysitters,
      presentToday,
      absentToday,
      lateToday
    ] = await Promise.all([
      // Count of all children
      Child.count(),
      
      // Count of all parents
      User.count({ where: { role: 'parent' } }),
      
      // Count of all babysitters
      User.count({ where: { role: 'babysitter' } }),
      
      // Count of children with at least one babysitter assigned
      Child.count({
        include: {
          model: User,
          as: 'babysitters',
          required: true
        }
      }),
      
      // Count of children present today
      Attendance.count({
        where: {
          date: { [Op.eq]: new Date().toISOString().split('T')[0] },
          status: 'present'
        }
      }),
      
      // Count of children absent today
      Attendance.count({
        where: {
          date: { [Op.eq]: new Date().toISOString().split('T')[0] },
          status: 'absent'
        }
      }),
      
      // Count of children late today
      Attendance.count({
        where: {
          date: { [Op.eq]: new Date().toISOString().split('T')[0] },
          status: 'late'
        }
      })
    ]);

    // Calculate missing metrics
    const childrenWithoutBabysitters = totalChildren - childrenWithBabysitters;
    const totalAttendanceToday = presentToday + absentToday + lateToday;
    const unrecordedAttendance = totalChildren - totalAttendanceToday;

    // Prepare and return response
    return res.json({
      success: true,
      data: {
        users: {
          totalParents,
          totalBabysitters,
          totalAdmins: 1 // Assuming at least one admin
        },
        children: {
          total: totalChildren,
          withBabysitters: childrenWithBabysitters,
          withoutBabysitters: childrenWithoutBabysitters
        },
        attendance: {
          date: new Date().toISOString().split('T')[0],
          present: presentToday,
          absent: absentToday,
          late: lateToday,
          unrecorded: unrecordedAttendance
        }
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get user counts by role
// @route   GET /api/admin/users/count
// @access  Private (Admin/Manager only)
exports.getUserCounts = async (req, res) => {
  try {
    const counts = await User.findAll({
      attributes: [
        'role',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    // Transform the results into a more user-friendly format
    const formattedCounts = {};
    counts.forEach(item => {
      formattedCounts[item.role] = parseInt(item.getDataValue('count'));
    });

    return res.json({
      success: true,
      data: formattedCounts
    });
  } catch (error) {
    console.error('Error getting user counts:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get attendance summary
// @route   GET /api/admin/attendance/summary
// @access  Private (Admin/Manager only)
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate date range
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    
    // Default to last 7 days if no dates provided
    if (!startDate) {
      start.setDate(start.getDate() - 6); // Last 7 days including today
    }

    // Get attendance counts by status and date
    const attendanceCounts = await Attendance.findAll({
      attributes: [
        'date',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        date: {
          [Op.between]: [start.toISOString().split('T')[0], end.toISOString().split('T')[0]]
        }
      },
      group: ['date', 'status'],
      order: [['date', 'ASC']]
    });

    // Transform the results into a more useful format
    const summary = {};
    
    // Initialize dates in range
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      summary[dateStr] = {
        present: 0,
        absent: 0,
        late: 0,
        total: 0
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Fill in actual counts
    attendanceCounts.forEach(record => {
      const dateStr = record.date;
      const status = record.status;
      const count = parseInt(record.getDataValue('count'));
      
      if (summary[dateStr]) {
        summary[dateStr][status] = count;
        summary[dateStr].total += count;
      }
    });

    return res.json({
      success: true,
      data: {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        summary
      }
    });
  } catch (error) {
    console.error('Error getting attendance summary:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get today's attendance
// @route   GET /api/admin/attendance/today
// @access  Private (Admin/Manager only)
exports.getTodayAttendance = async (req, res) => {
  try {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Get all children with their attendance for today
    const children = await Child.findAll({
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Attendance,
          where: {
            date: today
          },
          required: false
        }
      ]
    });
    
    // Transform the data to include attendance status
    const childrenWithStatus = children.map(child => {
      const childData = child.toJSON();
      
      // Determine attendance status
      let status = 'unrecorded';
      if (childData.Attendances && childData.Attendances.length > 0) {
        status = childData.Attendances[0].status;
      }
      
      return {
        id: childData.id,
        firstName: childData.firstName,
        lastName: childData.lastName,
        parent: childData.parent,
        attendanceStatus: status,
        // Include any additional fields needed for the dashboard
        recordedAt: childData.Attendances && childData.Attendances.length > 0 
          ? childData.Attendances[0].updatedAt 
          : null
      };
    });
    
    // Count by status
    const statusCounts = {
      present: childrenWithStatus.filter(c => c.attendanceStatus === 'present').length,
      absent: childrenWithStatus.filter(c => c.attendanceStatus === 'absent').length,
      late: childrenWithStatus.filter(c => c.attendanceStatus === 'late').length,
      unrecorded: childrenWithStatus.filter(c => c.attendanceStatus === 'unrecorded').length
    };

    return res.json({
      success: true,
      date: today,
      counts: statusCounts,
      data: childrenWithStatus
    });
  } catch (error) {
    console.error('Error getting today\'s attendance:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 