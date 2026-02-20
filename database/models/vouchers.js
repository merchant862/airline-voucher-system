'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vouchers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  vouchers.init({
    companyId: DataTypes.INTEGER,
    voucherNo: DataTypes.STRING,
    departureFlightDate: DataTypes.DATE,
    departureFlightNo: DataTypes.STRING,
    departureFlightFromCity: DataTypes.STRING,
    departureFlightToCity: DataTypes.STRING,
    departureFlightTakeOffTime: DataTypes.TIME,
    departureFlightLandingTime: DataTypes.TIME,
    arrivalFlightDate: DataTypes.DATE,
    arrivalFlightNo: DataTypes.STRING,
    arrivalFlightFromCity: DataTypes.STRING,
    arrivalFlightToCity: DataTypes.STRING,
    arrivalFlightTakeOffTime: DataTypes.TIME,
    arrivalFlightLandingTime: DataTypes.TIME,
    foreignCompanyId: DataTypes.INTEGER,
    voucherFormatsId: DataTypes.INTEGER,
    linkVoucherFormatsId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'vouchers',
  });
  return vouchers;
};