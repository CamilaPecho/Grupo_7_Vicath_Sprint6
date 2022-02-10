'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.DECIMAL
      },
      date: {
        type: Sequelize.DATE
      },
      payment_method_id: {
        type: Sequelize.INTEGER,
        references:{ 
          model:"paymentMethods",
          key:"id"
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references:{ 
          model:"users",
          key:"id"
        }
      },
      user_address_id: {
        type: Sequelize.INTEGER,
        references:{ 
          model:"deliveryData",
          key:"id"
        }
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
    await queryInterface.dropTable('orders');
  }
};