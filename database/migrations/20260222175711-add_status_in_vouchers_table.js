'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('vouchers', 'status', {
      type: Sequelize.ENUM('active', 'inactive'),  // ✅ ENUM values
      allowNull: false,
      defaultValue: 'active'                      // ✅ default active
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('vouchers', 'status');
  }
};