'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('agencies', [
      {
        name: 'MEEM TRAVELS',
        image: 'public/images/meem_travels.png',
        address: 'Office Unit:727,Block-14,Al-Mashriq Shopping Centre Gulshan-e-iqbal',
        phone: null,
        email: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('agencies', null, {});
  }
};
