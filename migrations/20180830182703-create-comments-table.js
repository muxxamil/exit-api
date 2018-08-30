'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comments', {

      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      againstType: {
        type: Sequelize.ENUM('blog', 'comment'),
        allowNull: false,
        field: 'against_type'
      },
      againstId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        field: 'against_id'
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      active: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
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
