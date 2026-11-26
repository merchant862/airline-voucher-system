'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('vouchers', 'createRequestId', {
      type: Sequelize.STRING(64),
      allowNull: true,
      unique: true
    });

    await queryInterface.addColumn('vouchers', 'detailsFingerprint', {
      type: Sequelize.STRING(64),
      allowNull: true,
      unique: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('vouchers', 'createRequestId');
    await queryInterface.removeColumn('vouchers', 'detailsFingerprint');
  }
};
