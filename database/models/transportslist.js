'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transportsList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  transportsList.init({
    type: DataTypes.ENUM('Private Car', 'Economy Bus'),
    route: DataTypes.ENUM('JED-MAK','MAK-MED-MAK','JED-MAK-MED-MAK-JED','MAK-JED','MAK-MED','MED-MAK')
  }, {
    sequelize,
    modelName: 'transportsList',
  });
  return transportsList;
};