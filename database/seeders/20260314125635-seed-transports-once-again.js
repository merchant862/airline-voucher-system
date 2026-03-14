'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('transportsLists', [
      {
        type: 'Economy Bus',
        route: 'MAK-MED-MAK-JED',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transportsLists', null, {});
  }
};
