'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const hotels = [
      // Makkah
      ['Le Meridien Towers Makkah', '3-star'],
      ['Elaf Bakkah Hotel', '3-star'],
      ['Ibis Styles Makkah', '3-star'],
      ['Blue Coral Hotel', '3-star'],
      ['Al Kiswah Towers Hotel', '3-star'],
      ['Nour Al Thuraya Hotel', '3-star'],
      ['Hibatullah Hotel Makkah by Accorhotels', '3-star'],
      ['Worth Elite Hotel', '3-star'],
      ['Al Hidayah Towers Hotel', '3-star'],
      ['Ramada by Wyndham Makkah Zad Al Tayseer', '3-star'],
      ['Makarem Mina Hotel', '3-star'],
      ['Emaar Legend', '3-star'],
      ['Palestine Hotel Makkah', '2-star'],
      ['Elaf Ajyad Hotel', '2-star'],
      ['Abraj Almisk Hotel', '1-star'],
      ['Afraa Hotel', '1-star'],
      ['Al Barakah Mawaddah Hotel', '2-star'],
      ['Al Kiram Hotel', '3-star'],
      ['Al Rayyan Towers Hotel', '3-star'],
      ['Alayam Elite Hotel', '1-star'],
      ['Elaf Qinwan Hotel', '3-star'],
      ['Emaar Al Khalil', '3-star'],
      ['Hotel 21 Makkah', '3-star'],
      ['Hotel Burj Al Diyafa Mubarak', '1-star'],

      // Madinah
      ['New Madinah Hotel', '3-star'],
      ['Zaha Al Munawara Hotel', '3-star'],
      ['Rua Al Hijrah Hotel', '3-star'],
      ['Hotel Taba Al Salam', '3-star'],
      ['Al Alya Hotel Rooms and Suites', '3-star'],
      ['Tulip Inn Al Daar Rawafid', '3-star'],
      ['Mysk Touch Al Balad Rawafed Hotel', '3-star'],
      ['Taiba Front Hotel', '3-star'],
      ['Emaar Mektan', '3-star'],
      ['Doosh Teeba Hotel Suites', '3-star'],
      ['Al Asr Almasi Suite Apartments', '3-star'],
      ['Araek Taibah', '3-star'],
      ['Durrat Al Eiman Hotel', '3-star'],
      ['Grand Zowar', '3-star'],
      ['Hasana Suites', '3-star'],
      ['Jasmien Golden', '3-star'],
      ['Mokhtara Diamond', '3-star'],
      ['Mokhtara International', '3-star'],
      ['Odst Al Madinah Hotel', '3-star'],
      ['Tu Jardin Tabba', '3-star'],
      ['Sela Hotel', '2-star'],
      ['Dar Al Eiman Ohud', '2-star'],
      ['Golden Tulip Al Zahabi', '2-star'],
      ['Al Eairy Furnished Apartment Al Madinah 3', '2-star'],
      ['Al Mokhtara Golden Hotel', '2-star'],
      ['Artal Taiba Hotel', '2-star'],
      ['Y Platinum', '1-star'],
      ['Sidra Alia Al-Dahabi Hotel', '1-star'],
      ['Delights Inn - Green Oasis Hotel', '1-star'],
      ['Emaar Taiba Hotel', '1-star']
    ];

    const rows = hotels.map(([name, stars]) => ({
      name: `${name} (${stars})`,
      city: 'MAKKAH',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // The source list is split by city below so every row gets the right enum value.
    const makkahCount = 24;
    rows.forEach((row, index) => {
      row.city = index < makkahCount ? 'MAKKAH' : 'MADINAH';
    });

    const existing = await queryInterface.sequelize.query(
      'SELECT name, city FROM hotelsLists WHERE city IN (:cities)',
      {
        replacements: { cities: ['MAKKAH', 'MADINAH'] },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    const existingKeys = new Set(existing.map(row => `${row.city}:${row.name}`));
    const newRows = rows.filter(row => !existingKeys.has(`${row.city}:${row.name}`));

    if (newRows.length) {
      await queryInterface.bulkInsert('hotelsLists', newRows, {});
    }
  },

  async down(queryInterface, Sequelize) {
    const names = [
      'Le Meridien Towers Makkah', 'Elaf Bakkah Hotel', 'Ibis Styles Makkah', 'Blue Coral Hotel',
      'Al Kiswah Towers Hotel', 'Nour Al Thuraya Hotel', 'Hibatullah Hotel Makkah by Accorhotels',
      'Worth Elite Hotel', 'Al Hidayah Towers Hotel', 'Ramada by Wyndham Makkah Zad Al Tayseer',
      'Makarem Mina Hotel', 'Emaar Legend', 'Palestine Hotel Makkah', 'Elaf Ajyad Hotel',
      'Abraj Almisk Hotel', 'Afraa Hotel', 'Al Barakah Mawaddah Hotel', 'Al Kiram Hotel',
      'Al Rayyan Towers Hotel', 'Alayam Elite Hotel', 'Elaf Qinwan Hotel', 'Emaar Al Khalil',
      'Hotel 21 Makkah', 'Hotel Burj Al Diyafa Mubarak', 'New Madinah Hotel', 'Zaha Al Munawara Hotel',
      'Rua Al Hijrah Hotel', 'Hotel Taba Al Salam', 'Al Alya Hotel Rooms and Suites',
      'Tulip Inn Al Daar Rawafid', 'Mysk Touch Al Balad Rawafed Hotel', 'Taiba Front Hotel',
      'Emaar Mektan', 'Doosh Teeba Hotel Suites', 'Al Asr Almasi Suite Apartments', 'Araek Taibah',
      'Durrat Al Eiman Hotel', 'Grand Zowar', 'Hasana Suites', 'Jasmien Golden', 'Mokhtara Diamond',
      'Mokhtara International', 'Odst Al Madinah Hotel', 'Tu Jardin Tabba', 'Sela Hotel',
      'Dar Al Eiman Ohud', 'Golden Tulip Al Zahabi', 'Al Eairy Furnished Apartment Al Madinah 3',
      'Al Mokhtara Golden Hotel', 'Artal Taiba Hotel', 'Y Platinum', 'Sidra Alia Al-Dahabi Hotel',
      'Delights Inn - Green Oasis Hotel', 'Emaar Taiba Hotel'
    ];

    await queryInterface.bulkDelete('hotelsLists', {
      [Sequelize.Op.or]: names.map(name => ({
        name: { [Sequelize.Op.like]: `${name} (%)` }
      })),
      city: { [Sequelize.Op.in]: ['MAKKAH', 'MADINAH'] }
    }, {});
  }
};
