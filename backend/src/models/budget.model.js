const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { EXPENSE_CATEGORIES, BUDGET_PERIODS } = require('../config/constants');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  period: {
    type: DataTypes.ENUM(Object.values(BUDGET_PERIODS)),
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2000,
      max: 2100
    }
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 12
    }
  },
  week: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 53
    }
  },
  day: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM(Object.values(EXPENSE_CATEGORIES)),
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['period', 'year', 'month'],
      name: 'budget_period_idx'
    },
    {
      fields: ['category'],
      name: 'budget_category_idx'
    },
    {
      fields: ['createdById'],
      name: 'budget_created_by_idx'
    },
    {
      fields: ['startDate', 'endDate'],
      name: 'budget_date_range_idx'
    }
  ],
  hooks: {
    beforeValidate: (budget) => {
      // Set appropriate date fields based on period
      const currentDate = new Date();
      
      if (!budget.year) {
        budget.year = currentDate.getFullYear();
      }
      
      switch (budget.period) {
        case BUDGET_PERIODS.YEARLY:
          budget.month = null;
          budget.week = null;
          budget.day = null;
          
          budget.startDate = new Date(budget.year, 0, 1);
          budget.endDate = new Date(budget.year, 11, 31);
          break;
          
        case BUDGET_PERIODS.MONTHLY:
          if (!budget.month) {
            budget.month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
          }
          budget.week = null;
          budget.day = null;
          
          budget.startDate = new Date(budget.year, budget.month - 1, 1);
          // Get last day of the month
          budget.endDate = new Date(budget.year, budget.month, 0);
          break;
          
        case BUDGET_PERIODS.WEEKLY:
          if (!budget.week) {
            // Calculate current week number
            const startOfYear = new Date(budget.year, 0, 1);
            const millisecondsPerDay = 86400000;
            const daysPassed = Math.floor((currentDate - startOfYear) / millisecondsPerDay);
            budget.week = Math.ceil((daysPassed + startOfYear.getDay() + 1) / 7);
          }
          budget.day = null;
          
          // Calculate start and end dates based on week number
          const firstDayOfYear = new Date(budget.year, 0, 1);
          const daysOffset = firstDayOfYear.getDay() > 0 ? firstDayOfYear.getDay() - 1 : 6;
          const firstWeekStart = new Date(firstDayOfYear);
          firstWeekStart.setDate(firstWeekStart.getDate() - daysOffset);
          
          budget.startDate = new Date(firstWeekStart);
          budget.startDate.setDate(firstWeekStart.getDate() + (budget.week - 1) * 7);
          
          budget.endDate = new Date(budget.startDate);
          budget.endDate.setDate(budget.startDate.getDate() + 6);
          break;
          
        case BUDGET_PERIODS.DAILY:
          if (!budget.day) {
            budget.day = new Date().toISOString().split('T')[0];
          }
          budget.month = new Date(budget.day).getMonth() + 1;
          budget.week = null;
          
          budget.startDate = new Date(budget.day);
          budget.endDate = new Date(budget.day);
          break;
      }
    }
  }
});

module.exports = Budget; 