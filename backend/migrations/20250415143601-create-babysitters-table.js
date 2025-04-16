'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Babysitters', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nin: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'National Identification Number'
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      nextOfKinName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nextOfKinPhone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nextOfKinRelationship: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'on_leave'),
        defaultValue: 'active'
      },
      paymentRate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5000,
        comment: 'Payment rate per day'
      },
      childrenAssigned: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      lastPaymentDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('Babysitters', ['userId']);
    await queryInterface.addIndex('Babysitters', ['nin']);
    await queryInterface.addIndex('Babysitters', ['status']);
    await queryInterface.addIndex('Babysitters', ['dateOfBirth']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Babysitters');
  }
};
