'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove companyId column from vouchers table
    await queryInterface.removeColumn('vouchers', 'companyId');
  },

  async down(queryInterface, Sequelize) {
    // Add companyId column back in case of rollback
    await queryInterface.addColumn('vouchers', 'companyId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'agencies', // 👈 table name (exact DB table name)
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};