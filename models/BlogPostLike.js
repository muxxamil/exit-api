'use strict';

module.exports = function (sequelize, DataTypes) {

    const BlogPostLike = sequelize.define('BlogPostLike', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        blogId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field    : 'blog_id'
        },
        likedByType: {
            type: DataTypes.ENUM('ip'),
            allowNull: false,
            field    : 'liked_by_type'
        },
        likedBy: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field    : 'liked_by'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at'
        }
    }, {

        tableName: 'blog_post_likes'
    });

    return BlogPostLike;
}
