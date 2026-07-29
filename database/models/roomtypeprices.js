'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class roomTypePrices extends Model {
    static associate(models) {
      // no associations
    }
  }

  roomTypePrices.init({
    roomType: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'roomTypePrices',
  });

  return roomTypePrices;
};
