'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create table with unique constraint on email
    await queryInterface.sequelize.query(`
      CREATE TABLE Users (
        id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        role ENUM('admin', 'parent', 'babysitter') NOT NULL,
        phoneNumber VARCHAR(255),
        address VARCHAR(255),
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY users_email_unique (email),
        KEY users_role_index (role),
        KEY users_created_at_index (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryInterface.createTable('Expenses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      amount: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'overdue', 'cancelled'),
        allowNull: false,
        defaultValue: 'paid'
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
    await queryInterface.addIndex('Expenses', ['date']);
    await queryInterface.addIndex('Expenses', ['category']);
    await queryInterface.addIndex('Expenses', ['status']);
    await queryInterface.addIndex('Expenses', ['recordedById']);
    await queryInterface.addIndex('Expenses', ['paymentMethod']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Expenses');
  }
};
