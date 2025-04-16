const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { SESSION_TYPES } = require('../config/constants');

const Child = sequelize.define('Child', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
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
        
        if (age < 0 || age > 5) {
          throw new Error('Child must be between 0 and 5 years old');
        }
      }
    }
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  // Guardian Information
  guardianName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guardianEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  guardianPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guardianAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guardianOccupation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  guardianRelationship: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guardianNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sessionType: {
    type: DataTypes.ENUM(Object.values(SESSION_TYPES)),
    allowNull: false
  },
  emergencyContactName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emergencyContactPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emergencyContactRelationship: {
    type: DataTypes.STRING,
    allowNull: true
  },
  medicalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  specialNeeds: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dietaryRestrictions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  enrollmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'graduated'),
    defaultValue: 'active'
  },
  babysitterId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Babysitters',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['babysitterId']
    }
  ]
});

module.exports = Child; 