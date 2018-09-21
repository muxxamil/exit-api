'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rental_locations', {

      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      key: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      officeLocationId: {
          type: Sequelize.INTEGER(11),
          field: 'office_location_id',
          allowNull: false,
      },
      staffedHours: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          field: 'staffed_hours_booking',
          allowNull: false,
      },
      unStaffedHours: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          field: 'un_staffed_hours_booking',
          allowNull: false,
      },
      quotaImpact: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          field: 'quota_impact',
          allowNull: false,
      },
      active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
      },
      deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
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
