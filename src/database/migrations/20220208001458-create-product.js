'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.INTEGER
      },
      stock_min: {
        type: Sequelize.INTEGER
      },
      stock_max: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      discount: {
        type: Sequelize.DECIMAL
      },
      description: {
        type: Sequelize.STRING
      },
      extended_description: {
        type: Sequelize.TEXT
      },
      brand_id: {
        type: Sequelize.INTEGER,
        references:{ 
          model:"brands",
          key:"id"
        }
      },
      category_id: {
        type: Sequelize.INTEGER,
        references:{ 
          model:"categories",
          key:"id"
        }
      },
      color_id: {
        type: Sequelize.INTEGER,
        references:{ 
          model:"colors",
          key:"id"
        }
      },
      deleted: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};