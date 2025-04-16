const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
    defaultValue: 'info'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Class method to find unread notifications for a user
Notification.findUnreadByUserId = async function(userId) {
  return await this.findAll({
    where: {
      userId: userId,
      isRead: false
    },
    order: [['createdAt', 'DESC']]
  });
};

// Class method to count unread notifications
Notification.countUnreadByUserId = async function(userId) {
  return await this.count({
    where: {
      userId: userId,
      isRead: false
    }
  });
};

// Class method to mark notification as read
Notification.markAsRead = async function(notificationId) {
  const notification = await this.findByPk(notificationId);
  if (notification) {
    notification.isRead = true;
    await notification.save();
    return notification;
  }
  return null;
};

module.exports = Notification; 