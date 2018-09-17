'use strict';
const _         = require('lodash');

module.exports = function (sequelize, DataTypes) {

    const TagsBlogPostsMapping = sequelize.define('TagsBlogPostsMapping', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        tagId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'tag_id'
        },
        blogId: {
            type: DataTypes.ENUM('ip'),
            allowNull: false,
            field: 'blog_id'
        },
        active: {
            type: DataTypes.STRING(50),
            allowNull: false,
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

        tableName: 'tags_blog_posts_mapping'
    });

    TagsBlogPostsMapping.CONSTANTS = {
        ACTIVE: {
            YES: true,
            NO: false,
        }
    };

    TagsBlogPostsMapping.associate = function (models) {

        TagsBlogPostsMapping.belongsTo(models.Tag, {foreignKey: 'tagId'});

    };

    TagsBlogPostsMapping.createBlogPostAndTagIdsRelation = (params) => {
        let blogPostAndTagRelationPromises = [];
        _.forEach(params.tagIds, (singleTagId) => {
            blogPostAndTagRelationPromises.push(TagsBlogPostsMapping.create({
                blogId: params.blogId,
                tagId: singleTagId,
                active: TagsBlogPostsMapping.CONSTANTS.ACTIVE.YES,
            }));
        });

        return blogPostAndTagRelationPromises;
    }

    return TagsBlogPostsMapping;
}
