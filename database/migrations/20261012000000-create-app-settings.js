'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    const now = new Date();
    await queryInterface.bulkInsert('appSettings', [{
      key: 'voucherExpiryHoursAfterDeparture',
      value: '24',
      createdAt: now,
      updatedAt: now
    }]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('appSettings');
  }
};
