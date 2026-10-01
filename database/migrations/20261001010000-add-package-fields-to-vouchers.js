'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('vouchers', 'packageNumber', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('vouchers', 'packageName', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('vouchers', 'packageName');
    await queryInterface.removeColumn('vouchers', 'packageNumber');
  }
};
