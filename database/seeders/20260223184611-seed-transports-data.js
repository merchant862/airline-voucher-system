'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const types = ['Private Car', 'Economy Bus'];
    const routes = ['JED-MAK','MAK-MED-MAK','JED-MAK-MED-MAK-JED','MAK-JED','MAK-MED','MED-MAK'];

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