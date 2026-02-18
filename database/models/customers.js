'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customers.init({
    customerName: DataTypes.STRING,
    customerPassport: DataTypes.STRING,
    customerVisa: DataTypes.STRING,
    customerGender: DataTypes.ENUM('male', 'female', 'infant', 'children'), // ✅ enum values added
    customerPNR: DataTypes.STRING,
    voucherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'customers',
  });
  return customers;
};