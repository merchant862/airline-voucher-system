'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const [rows] = await queryInterface.sequelize.query(
      'SELECT id FROM agencies WHERE name = :name LIMIT 1',
      { replacements: { name: 'KTP travels' } }
    );

    const agency = {
      name: 'KTP travels',
      image: 'public/images/ktp.png',
      address: null,
      phone: null,
      email: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (rows.length) {
      await queryInterface.bulkUpdate('agencies', agency, { id: rows[0].id });
      return;
    }

    await queryInterface.bulkInsert('agencies', [agency]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('agencies', { name: 'KTP travels' });
  }
};
