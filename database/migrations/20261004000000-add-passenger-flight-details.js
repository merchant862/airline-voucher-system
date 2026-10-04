'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = {
      departureFlightDate: { type: Sequelize.DATE, allowNull: true },
      departureFlightNo: { type: Sequelize.STRING, allowNull: true },
      departureFlightFromCity: { type: Sequelize.STRING, allowNull: true },
      departureFlightToCity: { type: Sequelize.STRING, allowNull: true },
      departureFlightTakeOffTime: { type: Sequelize.TIME, allowNull: true },
      departureFlightLandingTime: { type: Sequelize.TIME, allowNull: true },
      arrivalFlightDate: { type: Sequelize.DATE, allowNull: true },
      arrivalFlightNo: { type: Sequelize.STRING, allowNull: true },
      arrivalFlightFromCity: { type: Sequelize.STRING, allowNull: true },
      arrivalFlightToCity: { type: Sequelize.STRING, allowNull: true },
      arrivalFlightTakeOffTime: { type: Sequelize.TIME, allowNull: true },
      arrivalFlightLandingTime: { type: Sequelize.TIME, allowNull: true }
    };

    const existing = await queryInterface.describeTable('customers');
    for (const [name, definition] of Object.entries(columns)) {
      if (!existing[name]) await queryInterface.addColumn('customers', name, definition);
    }
  },

  async down(queryInterface) {
    const existing = await queryInterface.describeTable('customers');
    for (const name of [
      'departureFlightDate', 'departureFlightNo', 'departureFlightFromCity',
      'departureFlightToCity', 'departureFlightTakeOffTime', 'departureFlightLandingTime',
      'arrivalFlightDate', 'arrivalFlightNo', 'arrivalFlightFromCity',
      'arrivalFlightToCity', 'arrivalFlightTakeOffTime', 'arrivalFlightLandingTime'
    ]) {
      if (existing[name]) await queryInterface.removeColumn('customers', name);
    }
  }
};
