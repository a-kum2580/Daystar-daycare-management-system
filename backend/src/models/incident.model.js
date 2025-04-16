const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { INCIDENT_TYPES, SEVERITY_LEVELS } = require('../config/constants');

const Incident = sequelize.define('Incident', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  childId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Children',
      key: 'id'
    }
  },
  incidentType: {
    type: DataTypes.ENUM(Object.values(INCIDENT_TYPES)),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  actionTaken: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  reportedById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  severity: {
    type: DataTypes.ENUM(Object.values(SEVERITY_LEVELS)),
    allowNull: false,
    defaultValue: SEVERITY_LEVELS.LOW
  },
  followUpRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  followUpNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parentNotified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notificationTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notifiedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'follow_up'),
    defaultValue: 'open'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['childId']
    },
    {
      fields: ['reportedById']
    },
    {
      fields: ['notifiedById']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Incident; 