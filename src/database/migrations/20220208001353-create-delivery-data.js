'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('deliveryData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      dni: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      number_street: {
        type: Sequelize.STRING
      },
      apartment_number: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      CPA: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('deliveryData');
  }
};