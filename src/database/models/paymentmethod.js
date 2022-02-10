'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class paymentMethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      paymentMethod.hasOne(models.order,{ 
        foreignKey: "paymentMethod_id",
        as:"order"
      });
    }
  }
  paymentMethod.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'paymentMethod',
  });
  return paymentMethod;
};