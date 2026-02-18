'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove customer-related columns
    await queryInterface.removeColumn('vouchers', 'customerName');
    await queryInterface.removeColumn('vouchers', 'customerPassport');
    await queryInterface.removeColumn('vouchers', 'customerVisa');
    await queryInterface.removeColumn('vouchers', 'customerGender');
    await queryInterface.removeColumn('vouchers', 'customerPNR');
    await queryInterface.removeColumn('vouchers', 'voucherPrintDateTime');
  },

  async down(queryInterface, Sequelize) {
    // Add columns back in case of rollback
    await queryInterface.addColumn('vouchers', 'customerName', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vouchers', 'customerPassport', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vouchers', 'customerVisa', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vouchers', 'customerGender', {
      type: Sequelize.ENUM('male','female','infant','children'),
      allowNull: true
    });
    await queryInterface.addColumn('vouchers', 'customerPNR', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vouchers', 'voucherPrintDateTime', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
