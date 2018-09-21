'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('location_bookings', {

      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      rentalLocationId: {
          type: Sequelize.INTEGER(11),
          field: 'rental_location_id',
          allowNull: false,
      },
      from: {
          type: Sequelize.DATE,
          field: 'booking_from',
          allowNull: false,
      },
      to: {
          type: Sequelize.DATE,
          field: 'booking_to',
          allowNull: false,
      },
      bookedBy: {
        type: Sequelize.INTEGER(11),
        field: 'booked_by',
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
