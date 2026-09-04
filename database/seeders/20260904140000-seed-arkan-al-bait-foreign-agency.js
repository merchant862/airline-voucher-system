'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const [rows] = await queryInterface.sequelize.query(
      'SELECT id FROM foreignAgencies WHERE name = :name LIMIT 1',
      { replacements: { name: 'ARKAN AL BAIT FOR UMRAH SERVICES' } }
    );

    const agency = {
      name: 'ARKAN AL BAIT FOR UMRAH SERVICES',
      image: 'public/images/arkan-al-bait-logo.webp',
      address: null,
      phone: null,
      email: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (rows.length) {
      await queryInterface.bulkUpdate('foreignAgencies', agency, { id: rows[0].id });
      return;
    }

    await queryInterface.bulkInsert('foreignAgencies', [agency]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('foreignAgencies', {
      name: 'ARKAN AL BAIT FOR UMRAH SERVICES'
    });
  }
};
