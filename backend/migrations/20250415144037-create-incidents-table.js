'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Incidents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      childId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Children',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      incidentType: {
        type: Sequelize.ENUM('injury', 'illness', 'behavior', 'accident', 'other'),
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      actionTaken: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      reportedById: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      severity: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'low'
      },
      followUpRequired: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      followUpNotes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      parentNotified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      notificationTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notifiedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('open', 'closed', 'follow_up'),
        defaultValue: 'open'
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
    await queryInterface.addIndex('Incidents', ['childId']);
    await queryInterface.addIndex('Incidents', ['date']);
    await queryInterface.addIndex('Incidents', ['incidentType']);
    await queryInterface.addIndex('Incidents', ['severity']);
    await queryInterface.addIndex('Incidents', ['status']);
    await queryInterface.addIndex('Incidents', ['reportedById']);
    await queryInterface.addIndex('Incidents', ['notifiedById']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Incidents');
  }
};
