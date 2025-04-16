const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Babysitter = sequelize.define('Babysitter', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  nin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'National Identification Number'
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isValidAge(value) {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 21 || age > 35) {
          throw new Error('Babysitter must be between 21 and 35 years old');
        }
      }
    }
  },
  nextOfKinName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nextOfKinPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nextOfKinRelationship: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'on_leave'),
    defaultValue: 'active'
  },
  paymentRate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5000,
    comment: 'Payment rate per day'
  },
  childrenAssigned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastPaymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['nin']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Babysitter; 