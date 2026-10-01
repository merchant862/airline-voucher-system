'use strict';

module.exports = {
  async up(queryInterface) {
    const formats = [
      {
        ejsPath: 'views/voucher_formats/ktp2.ejs',
        name: 'DOWNLOAD_FORMAT'
      },
      {
        ejsPath: 'views/voucher_formats/ktp2-link.ejs',
        name: 'LINK_FORMAT'
      }
    ];

    for (const format of formats) {
      const [rows] = await queryInterface.sequelize.query(
        'SELECT id FROM voucherFormats WHERE ejsPath = :ejsPath LIMIT 1',
        { replacements: { ejsPath: format.ejsPath } }
      );

      if (rows.length) {
        await queryInterface.bulkUpdate(
          'voucherFormats',
          { name: format.name, updatedAt: new Date() },
          { id: rows[0].id }
        );
      } else {
        await queryInterface.bulkInsert('voucherFormats', [{
          ...format,
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('voucherFormats', {
      ejsPath: {
        [Sequelize.Op.in]: [
          'views/voucher_formats/ktp2.ejs',
          'views/voucher_formats/ktp2-link.ejs'
        ]
      }
    });
  }
};
