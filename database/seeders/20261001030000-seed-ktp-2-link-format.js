'use strict';

module.exports = {
  async up(queryInterface) {
    const ejsPath = 'views/voucher_formats/ktp-2-link.ejs';
    const [rows] = await queryInterface.sequelize.query(
      'SELECT id FROM voucherFormats WHERE ejsPath = :ejsPath LIMIT 1',
      { replacements: { ejsPath } }
    );

    if (rows.length) {
      await queryInterface.bulkUpdate('voucherFormats', { name: 'LINK_FORMAT', updatedAt: new Date() }, { id: rows[0].id });
      return;
    }

    await queryInterface.bulkInsert('voucherFormats', [{
      ejsPath,
      name: 'LINK_FORMAT',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('voucherFormats', {
      ejsPath: 'views/voucher_formats/ktp-2-link.ejs'
    });
  }
};
