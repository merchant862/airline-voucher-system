'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vouchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'agencies', // 👈 table name (exact DB table name)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      voucherNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      voucherPrintDateTime: {
        type: Sequelize.DATE
      },
      customerName: {
        type: Sequelize.STRING
      },
      customerPassport: {
        type: Sequelize.STRING
      },
      customerVisa: {
        type: Sequelize.STRING
      },
      customerGender: {
        type: Sequelize.ENUM('male', 'female', 'infant', 'children'),
        allowNull: false
      },
      customerPNR: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      departureFlightDate: {
        type: Sequelize.DATE
      },
      departureFlightNo: {
        type: Sequelize.STRING
      },
      departureFlightFromCity: {
        type: Sequelize.STRING
      },
      departureFlightToCity: {
        type: Sequelize.STRING
      },
      departureFlightTakeOffTime: {
        type: Sequelize.TIME
      },
      departureFlightLandingTime: {
        type: Sequelize.TIME
      },
      arrivalFlightDate: {
        type: Sequelize.DATE
      },
      arrivalFlightNo: {
        type: Sequelize.STRING
      },
      arrivalFlightFromCity: {
        type: Sequelize.STRING
      },
      arrivalFlightToCity: {
        type: Sequelize.STRING
      },
      arrivalFlightTakeOffTime: {
        type: Sequelize.TIME
      },
      arrivalFlightLandingTime: {
        type: Sequelize.TIME
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vouchers');
  }
};