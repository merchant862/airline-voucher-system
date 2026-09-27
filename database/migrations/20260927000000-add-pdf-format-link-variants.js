'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('voucherFormats', [
      {
        ejsPath: 'views/voucher_formats/irfan-link.ejs',
        name: 'LINK_FORMAT',
        createdAt: now,
        updatedAt: now
      },
      {
        ejsPath: 'views/voucher_formats/sudais-link.ejs',
        name: 'LINK_FORMAT',
        createdAt: now,
        updatedAt: now
      },
      {
        ejsPath: 'views/voucher_formats/meem1-link.ejs',
        name: 'LINK_FORMAT',
        createdAt: now,
        updatedAt: now
      },
      {
        ejsPath: 'views/voucher_formats/reference-pdf-link.ejs',
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
          'views/voucher_formats/irfan-link.ejs',
          'views/voucher_formats/sudais-link.ejs',
          'views/voucher_formats/meem1-link.ejs',
          'views/voucher_formats/reference-pdf-link.ejs'
        ]
      }
    });
  }
};
