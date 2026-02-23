'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transportsLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('Private Car', 'Economy Bus')
      },
      route: {
        type: Sequelize.ENUM('JED-MAK','MAK-MED-MAK','JED-MAK-MED-MAK-JED','MAK-JED','MAK-MED','MED-MAK')
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transportsLists');
  }
};