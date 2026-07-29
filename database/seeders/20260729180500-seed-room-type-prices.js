'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('roomTypePrices', [
      { roomType: 'sharing', price: 0, createdAt: now, updatedAt: now },
      { roomType: 'quint', price: 0, createdAt: now, updatedAt: now },
      { roomType: 'quad', price: 0, createdAt: now, updatedAt: now },
      { roomType: 'triple', price: 0, createdAt: now, updatedAt: now },
      { roomType: 'double', price: 0, createdAt: now, updatedAt: now }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roomTypePrices', null, {});
  }
};
