'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('voucherFormats', [{
      ejsPath: 'views/voucher_formats/tour-pvt-link.ejs',
      name: 'LINK_FORMAT',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('voucherFormats', {
      ejsPath: 'views/voucher_formats/tour-pvt-link.ejs'
    });
  }
};
