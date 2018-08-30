'use strict';
const _                                 = require('lodash');

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
        preDetail: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'pre_detail'
        },
        videoUrl: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field    : 'video_url'
        },
        postDetail: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'post_detail'
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

        BlogPost.hasMany(models.Attachment, {foreignKey: 'againstId', scope: { against_type: ['blog'] }});
        BlogPost.hasMany(models.BlogPostLike, {foreignKey: 'blogId'});
        BlogPost.hasMany(models.Comment, {foreignKey: 'againstId', scope: { against_type: ['blog'] }});
        BlogPost.hasMany(models.TagsBlogPostsMapping, {foreignKey: 'blogId'});

    };

    BlogPost.CONSTANTS = {
        ACTIVE: {
            YES: true,
            NO: false,
        }
    }

    BlogPost.getBlogPosts = (params) => {

        let options = {};
        options.subQuery = false;
        options.where = BlogPost.getRawParams(params);
        if(!params.hasOwnProperty('active')) {
            options.where.active = BlogPost.CONSTANTS.ACTIVE.YES
        }
        options.include = [
            {
                model : sequelize.models.User,
                as: 'AddedBy',
                attributes: ['name'],
                required: true
            }
            
        ];
        console.log("options.include", options.include);
        let countPromise = BlogPost.find({
            attributes: [ [ sequelize.literal('count(*)'), 'count' ] ],
            include: _.clone(options.include),
            raw: true,
            where: _.clone(options.where),
            group: 'BlogPost.id'
        });
        options.attributes = { exclude: ['active', 'updatedBy', 'updatedAt'] };
        let limitOptions = BlogPost.setPagination(params);

        if(limitOptions.limit) {
            options.limit = limitOptions.limit
        }
        if(limitOptions.offset || limitOptions.offset == 0) {
            options.offset = limitOptions.offset
        }

        console.log("options.include", options.include);
        BlogPost.appendOptionalIncludeStatements(options.include);
        let dataPromise = BlogPost.findAll(options);
        return {
            dataPromise: dataPromise,
            countPromise: countPromise
        }

    }

    BlogPost.appendOptionalIncludeStatements = (options) => {
        options.push({
            model : sequelize.models.Comment,
            attributes: { exclude: ['active', 'againstType', 'status'] },
            where: {
                active: sequelize.models.Comment.CONSTANTS.ACTIVE.YES,
                againstType: sequelize.models.Comment.CONSTANTS.AGAINST_TYPE.BLOG,
                status: sequelize.models.Comment.CONSTANTS.STATUS.APPROVED
            },
            required: false,
            include: [
                {
                    model : sequelize.models.Comment,
                    as: 'CommentsAgainstComment',
                    attributes: { exclude: ['active', 'againstType', 'status'] },
                    required: false,
                    where: {
                        active: sequelize.models.Comment.CONSTANTS.ACTIVE.YES,
                        status: sequelize.models.Comment.CONSTANTS.STATUS.APPROVED
                    },
                }
            ]
        });
        options.push({
            model : sequelize.models.TagsBlogPostsMapping,
            attributes: ['tagId'],
            required: false,
            where: {
                active: sequelize.models.TagsBlogPostsMapping.CONSTANTS.ACTIVE.YES
            },
            include: [
                {
                    model : sequelize.models.Tag,
                    attributes: ['title'],
                    where: {
                        active: sequelize.models.Tag.CONSTANTS.ACTIVE.YES
                    },
                }
            ]
        });
        options.push({
            model : sequelize.models.Attachment,
            attributes: { exclude: ['against_type', 'type', 'active', 'updatedBy', 'updatedAt'] },
            where: {
                active: sequelize.models.Attachment.CONSTANTS.ACTIVE.YES,
                againstType: sequelize.models.Attachment.CONSTANTS.AGAINST_TYPE.BLOG,
                type: sequelize.models.Attachment.CONSTANTS.TYPE.IMAGE
            },
            required: false
        });
        options.push({
            model : sequelize.models.BlogPostLike,
            attributes: ['id'],
        });
    }

    return BlogPost;
}
