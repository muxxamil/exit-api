'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('attachments', {

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
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('image'),
        allowNull: false,
      },
      againstType: {
        type: Sequelize.ENUM('blog'),
        allowNull: false,
        field: 'against_type'
      },
      againstId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        field: 'against_id'
      },
      active: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
      },
      addedBy: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        field: 'added_by'
      },
      updatedBy: {
        type: Sequelize.INTEGER(11),
        field: 'updated_by'
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
