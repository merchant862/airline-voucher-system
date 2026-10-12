'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class appSettings extends Model {}

  appSettings.init({
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'appSettings'
  });

  return appSettings;
};
