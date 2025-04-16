const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Notification;
}; 