'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        type: Sequelize.STRING
      },
      voucherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vouchers', // 👈 table name (exact DB table name)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('customers');
  }
};