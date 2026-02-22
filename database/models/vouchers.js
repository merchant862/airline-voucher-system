'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class vouchers extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // ====================== HasMany ======================
      vouchers.hasMany(models.customers, { foreignKey: 'voucherId', as: 'customers' });
      vouchers.hasMany(models.hotels, { foreignKey: 'voucherId', as: 'hotels' });
      vouchers.hasMany(models.transports, { foreignKey: 'voucherId', as: 'transports' });
      vouchers.hasMany(models.notes, { foreignKey: 'voucherId', as: 'notes' });

      // ====================== BelongsTo ======================
      vouchers.belongsTo(models.agencies, { foreignKey: 'companyId', as: 'company' });
      vouchers.belongsTo(models.foreignAgencies, { foreignKey: 'foreignCompanyId', as: 'foreignCompany' });
      vouchers.belongsTo(models.voucherFormats, { foreignKey: 'voucherFormatsId', as: 'voucherFormat' });
      vouchers.belongsTo(models.voucherFormats, { foreignKey: 'linkVoucherFormatsId', as: 'linkVoucherFormat' });
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
    linkVoucherFormatsId: DataTypes.INTEGER,
    status: DataTypes.ENUM('active', 'inactive'),
  }, {
    sequelize,
    modelName: 'vouchers',
  });

  return vouchers;
};