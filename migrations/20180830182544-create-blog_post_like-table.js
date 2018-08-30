'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('blog_post_likes', {

      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      blogId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        field: 'blog_id'
      },
      likedByType: {
        type: Sequelize.ENUM('ip'),
        allowNull: false,
        field: 'liked_by_type'
      },
      likedBy: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: 'liked_by'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at'
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
