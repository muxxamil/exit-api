'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {

      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        unique              : true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      cell: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      latitude: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      type: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      addedBy: {
        type: Sequelize.INTEGER(11),
        field: 'added_by'
      },
      updatedBy: {
        type: Sequelize.INTEGER(11),
        field: 'updated_by'
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    }
    )
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
