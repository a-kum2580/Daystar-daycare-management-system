'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      type: {
        type: Sequelize.ENUM('income', 'expense'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('tuition', 'salary', 'supplies', 'maintenance', 'other'),
        allowNull: false
      },
      paidById: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      paidToId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      paymentMethod: {
        type: Sequelize.ENUM('cash', 'credit_card', 'bank_transfer', 'other'),
        allowNull: false
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

    // Add indexes for frequently queried fields
    await queryInterface.addIndex('Payments', ['type']);
    await queryInterface.addIndex('Payments', ['status']);
    await queryInterface.addIndex('Payments', ['category']);
    await queryInterface.addIndex('Payments', ['paidById']);
    await queryInterface.addIndex('Payments', ['paidToId']);
    await queryInterface.addIndex('Payments', ['dueDate']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};
