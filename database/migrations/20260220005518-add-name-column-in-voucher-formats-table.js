'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add companyId column back in case of rollback
    await queryInterface.addColumn('voucherFormats', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove companyId column from vouchers table
    await queryInterface.removeColumn('voucherFormats', 'name');
  }
};