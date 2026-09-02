'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('vouchers', 'pdfTheme', {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: 'blue'
    });
    await queryInterface.addColumn('vouchers', 'linkTheme', {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: 'blue'
    });

    // Themes did not exist on old vouchers, so infer the closest legacy
    // appearance from the PDF/link format that was already stored.
    await queryInterface.sequelize.query(`
      UPDATE vouchers v
      LEFT JOIN voucherFormats pdfFormat ON pdfFormat.id = v.voucherFormatsId
      LEFT JOIN voucherFormats linkFormat ON linkFormat.id = v.linkVoucherFormatsId
      SET
        v.pdfTheme = CASE
          WHEN LOWER(COALESCE(pdfFormat.ejsPath, '')) LIKE '%meem%' THEN 'rose'
          WHEN LOWER(COALESCE(pdfFormat.ejsPath, '')) LIKE '%crm2%' THEN 'teal'
          ELSE 'blue'
        END,
        v.linkTheme = CASE
          WHEN LOWER(COALESCE(linkFormat.ejsPath, '')) LIKE '%meem%' THEN 'rose'
          WHEN LOWER(COALESCE(linkFormat.ejsPath, '')) LIKE '%crm2%' THEN 'teal'
          ELSE 'blue'
        END
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('vouchers', 'pdfTheme');
    await queryInterface.removeColumn('vouchers', 'linkTheme');
  }
};
