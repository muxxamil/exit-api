'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('staffed_hours', {

      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      objectType: {
          type: Sequelize.ENUM("office", "rental_location"),
          field: 'object_type',
          allowNull: false,
      },
      objectId: {
          type: Sequelize.INTEGER(11),
          field: 'object_id',
          allowNull: false,
      },
      dayNumber: {
          type: Sequelize.INTEGER(1),
          field: 'day_number',
          allowNull: false,
      },
      from: {
          type: Sequelize.TIME,
          field: 'from',
          allowNull: false,
      },
      to  : {
          type: Sequelize.TIME,
          field: 'to',
          allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
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
