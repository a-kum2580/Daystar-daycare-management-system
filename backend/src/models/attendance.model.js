const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { ATTENDANCE_STATUS } = require('../config/constants');

const Attendance = sequelize.define('Attendance', {
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
  personId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  personType: {
    type: DataTypes.ENUM('child', 'babysitter'),
    allowNull: false
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  checkOutTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(Object.values(ATTENDANCE_STATUS)),
    allowNull: false,
    defaultValue: ATTENDANCE_STATUS.ABSENT
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recordedById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['date', 'personId', 'personType']
    },
    {
      fields: ['personId']
    },
    {
      fields: ['recordedById']
    }
  ]
});

// Class method to find attendance by date and person
Attendance.findByDateAndPerson = async function(date, personId, personType) {
  return await this.findOne({
    where: {
      date,
      personId,
      personType
    }
  });
};

// Class method to get daily attendance
Attendance.getDailyAttendance = async function(date, personType) {
  return await this.findAll({
    where: {
      date,
      ...(personType && { personType })
    }
  });
};

module.exports = Attendance; 