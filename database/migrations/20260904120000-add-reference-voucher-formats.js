'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('voucherFormats', [
      {
        ejsPath: 'views/voucher_formats/reference-pdf.ejs',
        name: 'DOWNLOAD_FORMAT',
        createdAt: now,
        updatedAt: now
      },
      {
        ejsPath: 'views/voucher_formats/reference-link.ejs',
        name: 'LINK_FORMAT',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('voucherFormats', {
      ejsPath: {
        [Sequelize.Op.in]: [
          'views/voucher_formats/reference-pdf.ejs',
          'views/voucher_formats/reference-link.ejs'
        ]
      }
    });
  }
};
