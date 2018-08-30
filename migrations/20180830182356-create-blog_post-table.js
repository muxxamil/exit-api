'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('blog_posts', {

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
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      preDetail: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'pre_detail'
      },
      videoUrl: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'video_url'
      },
      postDetail: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'post_detail'
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
