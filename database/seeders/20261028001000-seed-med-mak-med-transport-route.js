'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const types = ['Private Car', 'Economy Bus'];

    for (const type of types) {
      const [rows] = await queryInterface.sequelize.query(
        'SELECT id FROM transportsLists WHERE type = :type AND route = :route LIMIT 1',
        { replacements: { type, route: 'MED-MAK-MED' } }
      );

      if (!rows.length) {
        await queryInterface.bulkInsert('transportsLists', [{
          type,
          route: 'MED-MAK-MED',
          createdAt: now,
          updatedAt: now
        }]);
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('transportsLists', {
      route: 'MED-MAK-MED'
    });
  }
};
