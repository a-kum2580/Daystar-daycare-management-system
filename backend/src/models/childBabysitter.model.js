const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChildBabysitter = sequelize.define('ChildBabysitter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  childId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Children',
      key: 'id'
    }
  },
  babysitterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  assignedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'ChildBabysitters',
  timestamps: true,
  indexes: [
    {
      fields: ['childId']
    },
    {
      fields: ['babysitterId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['assignedBy']
    }
  ]
});

module.exports = ChildBabysitter; 