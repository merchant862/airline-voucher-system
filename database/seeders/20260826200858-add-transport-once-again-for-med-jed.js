'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const types = ['Private Car', 'Economy Bus'];
    const routes = ['MED-JED'];

    const data = [];

    types.forEach(type => {
      routes.forEach(route => {
        data.push({
          type,
          route,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    });

    await queryInterface.bulkInsert('transportsLists', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transportsLists', null, {});
  }
};