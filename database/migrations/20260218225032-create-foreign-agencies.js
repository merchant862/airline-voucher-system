'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add companyId column back in case of rollback
    await queryInterface.addColumn('vouchers', 'foreignCompanyId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'foreignAgencies', // 👈 table name (exact DB table name)
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove companyId column from vouchers table
    await queryInterface.removeColumn('vouchers', 'foreignCompanyId');
  }
};