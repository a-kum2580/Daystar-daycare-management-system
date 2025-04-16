'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChildBabysitters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      childId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Children',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      babysitterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      assignedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      assignedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for frequently queried fields
    await queryInterface.addIndex('ChildBabysitters', ['childId']);
    await queryInterface.addIndex('ChildBabysitters', ['babysitterId']);
    await queryInterface.addIndex('ChildBabysitters', ['status']);
    await queryInterface.addIndex('ChildBabysitters', ['assignedBy']);
    
    // Add unique constraint to prevent duplicate assignments
    await queryInterface.addConstraint('ChildBabysitters', {
      fields: ['childId', 'babysitterId'],
      type: 'unique',
      name: 'unique_child_babysitter_assignment'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ChildBabysitters');
  }
}; 