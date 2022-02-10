'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      brand.hasMany(models.product,{ 
        foreignKey: "brand_id",
        as:"products"
      });
    }
  }
  brand.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'brand',
  });
  return brand;
};