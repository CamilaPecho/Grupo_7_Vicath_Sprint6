'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class deliveryData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      deliveryData.hasOne(models.order,{ 
        foreignKey: "user_address_id",
        as:"order"
      });
    }
  }
  deliveryData.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    dni: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    street: DataTypes.STRING,
    number_street: DataTypes.STRING,
    apartment_number: DataTypes.STRING,
    district: DataTypes.STRING,
    CPA: DataTypes.STRING,
    province: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'deliveryData',
  });
  return deliveryData;
};