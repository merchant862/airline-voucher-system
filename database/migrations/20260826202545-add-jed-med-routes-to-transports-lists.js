'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('transportsLists', 'route', {
      type: Sequelize.ENUM(
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('transportsLists', 'route', {
      type: Sequelize.ENUM(
        'JED-MAK',
        'MAK-MED-MAK',
        'JED-MAK-MED-MAK-JED',
        'MAK-JED',
        'MAK-MED',
        'MED-MAK'
      )
    });
  }
};