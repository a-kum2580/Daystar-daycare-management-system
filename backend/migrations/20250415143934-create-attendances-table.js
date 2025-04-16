'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attendances', {
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
      personId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      personType: {
        type: Sequelize.ENUM('child', 'babysitter'),
        allowNull: false
      },
      checkInTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      checkOutTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('present', 'absent', 'late', 'excused'),
        allowNull: false,
        defaultValue: 'absent'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.addIndex('Attendances', ['date']);
    await queryInterface.addIndex('Attendances', ['personId']);
    await queryInterface.addIndex('Attendances', ['personType']);
    await queryInterface.addIndex('Attendances', ['status']);
    await queryInterface.addIndex('Attendances', ['recordedById']);
    
    // Add unique constraint for date, personId, and personType
    await queryInterface.addIndex('Attendances', ['date', 'personId', 'personType'], {
      unique: true,
      name: 'attendances_date_person_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Attendances');
  }
};
