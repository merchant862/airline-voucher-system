'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('foreignAgencies', [
      {
        name: 'SHIRKA AL FAJAR',
        image: 'public/images/shirka-al-fajar.jpeg',
        address: null,
        phone: null,
        email: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('foreignAgencies', {
      name: 'SHIRKA AL FAJAR'
    }, {});
  }
};
