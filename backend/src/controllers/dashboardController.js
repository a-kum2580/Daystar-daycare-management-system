const { Child, User, Payment, Notification, Babysitter } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

/**
 * Get dashboard statistics and data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts from different collections
    const [
      totalBabysitters,
      totalChildren,
      totalParents,
      pendingPayments,
      recentNotifications,
      financialStats
    ] = await Promise.all([
      // Count active babysitters
      Babysitter.count({
        where: { status: 'active' }
      }),
      
      // Count active children
      Child.count({
        where: { status: 'active' }
      }),
      
      // Count active parents
      User.count({
        where: { 
          role: 'parent',
          status: 'active'
        }
      }),
      
      // Count pending payments
      Payment.count({
        where: { status: 'pending' }
      }),
      
      // Get recent notifications
      Notification.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        raw: true
      }),
      
      // Get financial stats for the last 30 days
      Payment.findAll({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.literal("CASE WHEN type = 'income' THEN amount ELSE 0 END")), 'income'],
          [sequelize.fn('SUM', sequelize.literal("CASE WHEN type = 'expense' THEN amount ELSE 0 END")), 'expenses']
        ],
        raw: true
      })
    ]);

    // Calculate balance
    const { income = 0, expenses = 0 } = financialStats[0] || {};
    const balance = income - expenses;

    res.json({
      stats: {
        totalBabysitters,
        totalChildren,
        totalParents,
        pendingPayments
      },
      notifications: recentNotifications.map(notification => ({
        id: notification.id,
        message: notification.message,
        createdAt: notification.createdAt
      })),
      financialSummary: {
        income,
        expenses,
        balance
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
}; 