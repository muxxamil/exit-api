'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_hours_quota', {

      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER(11),
        field: 'userid',
        allowNull: false,
      },
      staffedHours: {
        type: Sequelize.FLOAT,
        field: 'staffed_hours',
        allowNull: false,
      },
      unStaffedHours: {
        type: Sequelize.FLOAT,
        field: 'un_staffed_hours',
        allowNull: false,
      },
      addedBy: {
          type: Sequelize.INTEGER(11),
          field: 'added_by',
          allowNull: false,
      },
      updatedBy: {
          type: Sequelize.INTEGER(11),
          field: 'updated_by',
          allowNull: false,
      },
      expiry: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'expiry_datetime'
      },
      deleted: {
          type: Sequelize.BOOLEAN,
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
