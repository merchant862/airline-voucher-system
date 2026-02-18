'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('agencies', [
      {
        name: 'KARWAN-E-ISLAMI EXPRESS TRAVELS (SMC-PVT.) LTD.',
        image: 'public/images/karwaan-e-islami.png',
        address: '18-F, Raja Center, Main Boulevard, Gulberg-II, Lahore 54000, Pakistan.',
        phone: '(+92 42) 35874066 & 35753631',
        email: 'info@karwan-e-islami.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'QUICK TRAVEL SERVICES',
        image: 'public/images/quick-travel-agency.png',
        address: 'Office No. 202, 2nd Floor, Iconic Trade Center, Behind Medicare Hospital, BMCHS Block 3, Sharfabad, Karachi, Pakistan.',
        phone: '+92 322 3830039 , +92 330 3830039',
        email: 'quicktravelsevices@yahoo.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'PAK HARMAIN GROUP OF TRAVELS',
        image: 'public/images/pak-harmain.jpeg',
        address: 'G.Floor, Office Tower, 2 East AKM Fazl-ul-Haq Rd, Islamabad.',
        phone: '+92 300-855-0374',
        email: 'Pak.harmaintravels@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HURMAT E HARMAIN TRAVEL AND TOURS',
        image: 'public/images/hurmat-e-harmain.jpg',
        address: 'Shop 35 Yaseen Square Soldier Bazar, Karachi, Pakistan 74000',
        phone: '0300-2388848, 0300-2201265',
        email: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'SAFR-E-HIJAZ TRAVELS AND TOURS',
        image: 'public/images/safr-e-hijaaz.jpg',
        address: null,
        phone: null,
        email: 'fk235706676@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('agencies', null, {});
  }
};
