'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('foreignAgencies', [
      {
        name: 'DALEEL ALZOWAR - MADINAH ',
        image: 'public/images/daleel-alzowar.png',
        address: '6750 Prince Abdulmajeed Ibn Abdulaziz، DMAL3699, Madinah 42316',
        phone: ' +966 14 8478198, +966 920009987 ',
        email: 'info@daleelalzowar.sa',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('foreignAgencies', null, {});
  }
};
