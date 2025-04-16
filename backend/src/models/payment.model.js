const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('tuition', 'salary', 'supplies', 'maintenance', 'other'),
    allowNull: false
  },
  paidById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  paidToId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'credit_card', 'bank_transfer', 'other'),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Payments',
  timestamps: true,
  indexes: [
    {
      name: 'payments_status_created_at_idx',
      fields: ['status', 'createdAt']
    },
    {
      name: 'payments_type_created_at_idx',
      fields: ['type', 'createdAt']
    },
    {
      name: 'payments_paid_by_status_idx',
      fields: ['paidById', 'status']
    },
    {
      name: 'payments_paid_to_status_idx',
      fields: ['paidToId', 'status']
    }
  ]
});

module.exports = Payment; 