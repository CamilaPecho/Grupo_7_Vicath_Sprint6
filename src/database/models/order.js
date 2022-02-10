'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order.hasMany(models.orderDetail,{ 
        foreignKey: "order_id",
        as:"orderDetails"
      });

      order.belongsTo(models.paymentMethod,{ 
        foreignKey: "paymentMethod_id",
        as:"paymentMethod"
      });

      order.belongsTo(models.deliveryData,{ 
        foreignKey: "user_address_id",
        as:"deliveryData"
      });
    }
  }
  order.init({
    total: DataTypes.DECIMAL,
    date: DataTypes.DATE,
    payment_method_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    user_address_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};