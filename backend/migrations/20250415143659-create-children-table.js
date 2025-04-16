'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Children', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: false
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sessionType: {
        type: Sequelize.ENUM('full_day', 'half_day', 'after_school'),
        allowNull: false
      },
      emergencyContactName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      emergencyContactPhone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      emergencyContactRelationship: {
        type: Sequelize.STRING,
        allowNull: true
      },
      medicalNotes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      allergies: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      specialNeeds: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      medications: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      dietaryRestrictions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      enrollmentDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'graduated'),
        defaultValue: 'active'
      },
      babysitterId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Babysitters',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.addIndex('Children', ['parentId']);
    await queryInterface.addIndex('Children', ['babysitterId']);
    await queryInterface.addIndex('Children', ['status']);
    await queryInterface.addIndex('Children', ['enrollmentDate']);
    await queryInterface.addIndex('Children', ['dateOfBirth']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Children');
  }
};
