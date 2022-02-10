'use strict';
const {
  Model
} = require('sequelize');
const brand = require('./brand');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.belongsTo(models.brand,{ 
        foreignKey: "brand_id",
        as:"brand"
      });

      product.belongsTo(models.category,{ 
        foreignKey: "category_id",
        as:"category"
      });

      product.belongsTo(models.color,{ 
        foreignKey: "color_id",
        as:"color"
      });

      product.hasMany(models.image,{ 
        foreignKey: "product_id",
        as:"images"
      });

      product.hasOne(models.orderDetail,{ 
        foreignKey: "product_id",
        as:"orderDetail"
      });
    }
  }
  product.init({
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    stock_min: DataTypes.INTEGER,
    stock_max: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    discount: DataTypes.DECIMAL,
    description: DataTypes.STRING,
    extended_description: DataTypes.TEXT,
    brand_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    color_id: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};