const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { EXPENSE_CATEGORIES, PAYMENT_METHODS } = require('../config/constants');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  category: {
    type: DataTypes.ENUM(Object.values(EXPENSE_CATEGORIES)),
    allowNull: false
  },
  payee: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM(Object.values(PAYMENT_METHODS)),
    allowNull: false
  },
  receiptUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recordedById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
    defaultValue: 'paid'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Expense;