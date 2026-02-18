'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transports.init({
    type: DataTypes.STRING,
    route: DataTypes.STRING,
    voucherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transports',
  });
  return transports;
};