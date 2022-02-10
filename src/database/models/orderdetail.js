'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      orderDetail.belongsTo(models.product,{ 
        foreignKey: "product_id",
        as:"product"
      });

      orderDetail.belongsTo(models.order,{ 
        foreignKey: "order_id",
        as:"order"
      });

    }
  }
  orderDetail.init({
    quantity: DataTypes.INTEGER,
    subtotal: DataTypes.DECIMAL,
    product_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'orderDetail',
  });
  return orderDetail;
};