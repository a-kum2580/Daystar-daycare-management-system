'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      category: {
        type: Sequelize.ENUM('salaries', 'supplies', 'maintenance', 'utilities', 'other'),
        allowNull: false
      },
      payee: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      paymentMethod: {
        type: Sequelize.ENUM('cash', 'mobile_money', 'bank_transfer', 'credit_card', 'check', 'other'),
        allowNull: false
      },
      recordedById: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
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
    await queryInterface.addIndex('Expenses', ['date']);
    await queryInterface.addIndex('Expenses', ['category']);
    await queryInterface.addIndex('Expenses', ['status']);
    await queryInterface.addIndex('Expenses', ['recordedById']);
    await queryInterface.addIndex('Expenses', ['paymentMethod']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Expenses');
  }
};
