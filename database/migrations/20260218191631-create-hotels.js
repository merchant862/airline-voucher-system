'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hotels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hotelName: {
        type: Sequelize.STRING
      },
      confirmationNo: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      roomType: {
        type: Sequelize.STRING
      },
      mealPlan: {
        type: Sequelize.STRING,
        defaultValue: 'RO'
      },
      checkInDate: {
        type: Sequelize.DATE
      },
      checkOutDate: {
        type: Sequelize.DATE
      },
      noOfNights: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('hotels');
  }
};