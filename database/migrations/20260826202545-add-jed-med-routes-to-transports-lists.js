'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE transportsLists
      MODIFY COLUMN route ENUM(
        'JED-MAK',
        'MAK-MED-MAK',
        'JED-MAK-MED-MAK-JED',
        'MAK-JED',
        'MAK-MED',
        'MED-MAK',
        'JED-MED',
        'MED-JED',
        'MED-JED-MED',
        'JED-MED-JED'
      )
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE transportsLists
      MODIFY COLUMN route ENUM(
        'JED-MAK',
        'MAK-MED-MAK',
        'JED-MAK-MED-MAK-JED',
        'MAK-JED',
        'MAK-MED',
        'MED-MAK'
      )
    `);
  },
};