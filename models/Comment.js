'use strict';

module.exports = function (sequelize, DataTypes) {

    const Comment = sequelize.define('Comment', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        againstType: {
            type: DataTypes.ENUM('blog', 'comment'),
            allowNull: false,
            field: 'against_type'
        },
        againstId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'against_id'
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        active: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
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

        tableName: 'comments'
    });

    Comment.associate = function (models) {

        Comment.hasMany(models.Comment, { foreignKey    : 'againstId', as: 'CommentsAgainstComment',
                                                  scope         : { against_type: 'comment' } });

    };

    Comment.CONSTANTS = {
        ACTIVE: {
            YES: true,
            NO: false,
        },
        AGAINST_TYPE: {
            BLOG: 'blog',
            COMMENT: 'comment',
        },
        STATUS: {
            PENDING: 'pending',
            APPROVED: 'approved',
            REJECTED: 'rejected'
        }
    }

    return Comment;
}
