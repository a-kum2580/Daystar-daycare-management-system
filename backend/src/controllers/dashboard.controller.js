const { Child, User, Attendance, Payment, Incident } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get total children count
    const totalChildren = await Child.count() || 0;

    // Get children present today
    const childrenPresent = await Attendance.count({
      where: {
        date: today,
        status: 'present'
      }
    }) || 0;

    // Get active babysitters
    const activeBabysitters = await User.count({
      where: {
        role: 'babysitter',
        isActive: true
      }
    }) || 0;

    // Get today's income
    const todayIncome = await Payment.sum('amount', {
      where: {
        paymentDate: today,
        status: 'paid'
      }
    }) || 0;

    // Get weekly income
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklyIncome = await Payment.sum('amount', {
      where: {
        paymentDate: {
          [Op.gte]: weekStart
        },
        status: 'paid'
      }
    }) || 0;

    // Get pending payments
    const pendingPayments = await Payment.sum('amount', {
      where: {
        status: 'pending'
      }
    }) || 0;

    // Get recent incidents
    const recentIncidents = await Incident.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Child,
        as: 'child',
        attributes: ['firstName', 'lastName']
      }]
    }) || [];

    // Return dashboard data with default values for empty data
    res.json({
      stats: {
        childrenPresent,
        totalChildren,
        activeBabysitters,
        todayIncome,
        weeklyIncome,
        pendingPayments
      },
      recentIncidents,
      message: totalChildren === 0 ? "No data available yet. Start by adding children and babysitters." : null
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return empty dashboard data instead of an error
    res.json({
      stats: {
        childrenPresent: 0,
        totalChildren: 0,
        activeBabysitters: 0,
        todayIncome: 0,
        weeklyIncome: 0,
        pendingPayments: 0
      },
      recentIncidents: [],
      message: "No data available yet. Start by adding children and babysitters."
    });
  }
};

module.exports = {
  getDashboardStats
}; 