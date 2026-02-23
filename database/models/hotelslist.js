'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hotelsList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  hotelsList.init({
    name: DataTypes.STRING,
    city: DataTypes.ENUM('MAKKAH','MADINAH','RIYADH','JEDDAH')
  }, {
    sequelize,
    modelName: 'hotelsList',
  });
  return hotelsList;
};