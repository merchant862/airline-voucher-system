'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('voucherFormats', [
      {
        ejsPath: 'views/voucher_formats/meem1.ejs',
        name: 'DOWNLOAD_FORMAT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ejsPath: 'views/voucher_formats/meem2.ejs',
        name: 'LINK_FORMAT',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('voucherFormats', null, {});
  }
};
