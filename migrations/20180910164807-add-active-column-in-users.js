'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn(
        'users',
        'active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          after: "designation_id"
        }
      ),
    ];
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'active');
  }
};