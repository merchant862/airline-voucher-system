'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class hotels extends Model {
    static associate(models) {
      // associations can be defined here if needed later
      // hotels.belongsTo(models.vouchers, { foreignKey: 'voucherId' });
    }
  }

  hotels.init({
    voucherId: DataTypes.STRING,
    hotelName: DataTypes.STRING,
    confirmationNo: DataTypes.STRING,
    city: DataTypes.STRING,
    roomType: DataTypes.STRING,
    mealPlan: {
      type: DataTypes.STRING,
      defaultValue: 'RO'
    },
    checkInDate: DataTypes.DATEONLY,
    checkOutDate: DataTypes.DATEONLY,
    noOfNights: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'hotels',
  });

  return hotels;
};
