'use strict';

module.exports = function (sequelize, DataTypes) {

    const BlogPost = sequelize.define('BlogPost', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        detail: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        videoUrl: {
            type: DataTypes.STRING(050),
            allowNull: true,
            field    : 'video_url'
        },
        active: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
        },
        addedBy: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'added_by'
        },
        updatedBy: {
            type: DataTypes.INTEGER(11),
            field: 'updated_by'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updated_at'
        }
    }, {

        tableName: 'blog_posts'
    });

    BlogPost.associate = function (models) {

        BlogPost.belongsTo(models.User, {foreignKey: 'addedBy', as: 'AddedBy'});
        BlogPost.belongsTo(models.User, {foreignKey: 'updatedBy', as: 'UpeatedBy'});

        Task.hasMany(models.Attachment, {foreignKey: 'against_id', scope: { against_type: ['blog'] }});
        Task.hasMany(models.BlogPostLike, {foreignKey: 'blog_id'});
        Task.hasMany(models.Comment, {foreignKey: 'against_id', scope: { against_type: ['blog'] }});
        Task.hasMany(models.Tag, {foreignKey: 'blog_id'});

  };

    BlogPost.getBlogPosts = (params) => {

        let options = {};
        options = BlogPost.setPagination(params);
        options.attributes = { exclude: ['password'] };
        options.where = BlogPost.getRawParams(params);
        return BlogPost.findAndCountAll(options);

    }

    return BlogPost;
}
