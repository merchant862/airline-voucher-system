'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('hotelsLists', [

      // ================= MAKKAH =================
      { name: 'FAKHIR AL AZIZIA', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'QILA AJYAD', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'AL KISWAH TOWER', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'VOCO', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'THABAT HOTEL', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'LAND PREMIUM', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'MIAAD AL MAJD', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'MELLA 1', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'MELLA 2', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'DIWAN AL BAIT', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'SAIF AL MAJD', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'AREEJ AL ZAHBI', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'SHAMS AL ZAHBI', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'DHAIF AL AZIZIYAH (OLD MARKAD AJYAD)', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'BADAR AL MASSA', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'NAWARAT SHAMS 3', city: 'MAKKAH', createdAt: new Date(), updatedAt: new Date() },

      // ================= MADINAH =================
      { name: 'FUNDAQ AL RAYYAN', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'HALA TAIBAH', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'MANAZIL MARJAN', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'DIYAR AL SAFA (OLD SAFA CENTER)', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'WAHAT AL SHARK', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'NUZUL AL FALAH', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'HAMOUDA ZAHBI', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'BURJ MUKHTARA', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'BIR AL EIMAN / WARDA SAFA', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'TAIF NEBRAS', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'MARJAN GOLDEN', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },
      { name: 'RAMA AL MADINAH', city: 'MADINAH', createdAt: new Date(), updatedAt: new Date() },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('hotelsLists', null, {});
  }
};