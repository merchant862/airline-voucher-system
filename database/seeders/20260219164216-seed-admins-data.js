'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {

    const saltRounds = 12;

    const email = 'admin@saudia.chirosnap.com';

    // Strong random password
    const passwordPlain = 'Theracecon336#';

    const hashedPassword = await bcrypt.hash(passwordPlain, saltRounds);

    console.log("=================================");
    console.log("New Admin Created:");
    console.log("Email:", email);
    console.log("Password:", passwordPlain);
    console.log("=================================");

    await queryInterface.bulkInsert('admins', [{
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admins', null, {});
  }
};
