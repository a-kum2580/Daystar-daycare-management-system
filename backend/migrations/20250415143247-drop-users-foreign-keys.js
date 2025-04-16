'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop foreign key constraints
    const constraints = [
      { table: 'Notes', constraint: 'Notes_ibfk_82' },
      { table: 'Notifications', constraint: 'Notifications_ibfk_1' },
      { table: 'Education', constraint: 'Education_ibfk_1' },
      { table: 'Jobs', constraint: 'Jobs_ibfk_1' },
      { table: 'Categories', constraint: 'Categories_ibfk_14' },
      { table: 'Experiences', constraint: 'Experiences_ibfk_1' },
      { table: 'Applications', constraint: 'Applications_ibfk_84' },
      { table: 'Students', constraint: 'Students_ibfk_1' },
      { table: 'Lecturers', constraint: 'Lecturers_ibfk_1' },
      { table: 'Babysitters', constraint: 'Babysitters_ibfk_1' },
      { table: 'Incidents', constraint: 'Incidents_ibfk_96' },
      { table: 'Incidents', constraint: 'Incidents_ibfk_97' },
      { table: 'Budgets', constraint: 'Budgets_ibfk_1' },
      { table: 'Notifications', constraint: 'Notifications_ibfk_2' },
      { table: 'Expenses', constraint: 'Expenses_ibfk_1' },
      { table: 'Payments', constraint: 'Payments_ibfk_89' },
      { table: 'Payments', constraint: 'Payments_ibfk_90' },
      { table: 'Children', constraint: 'Children_ibfk_77' },
      { table: 'Attendances', constraint: 'Attendances_ibfk_1' }
    ];

    for (const { table, constraint } of constraints) {
      try {
        await queryInterface.sequelize.query(
          `ALTER TABLE ${table} DROP FOREIGN KEY ${constraint};`
        );
      } catch (error) {
        console.log(`Could not drop constraint ${constraint} on table ${table}: ${error.message}`);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // We don't restore the foreign keys in down migration
    // as they will be recreated with the new Users table structure
  }
};
