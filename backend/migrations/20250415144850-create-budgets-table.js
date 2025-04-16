'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Budgets', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      period: {
        type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'yearly'),
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      month: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 12
        }
      },
      week: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 53
        }
      },
      day: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      category: {
        type: Sequelize.ENUM('salaries', 'supplies', 'maintenance', 'utilities', 'other'),
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('Budgets', ['period', 'year', 'month'], {
      name: 'budget_period_idx'
    });
    await queryInterface.addIndex('Budgets', ['category'], {
      name: 'budget_category_idx'
    });
    await queryInterface.addIndex('Budgets', ['createdById'], {
      name: 'budget_created_by_idx'
    });
    await queryInterface.addIndex('Budgets', ['startDate', 'endDate'], {
      name: 'budget_date_range_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Budgets');
  }
}; 