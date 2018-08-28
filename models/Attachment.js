'use strict';

module.exports = function (sequelize, DataTypes) {

    const Attachment = sequelize.define('Attachment', {

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
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('image'),
            allowNull: false,
        },
        against_type: {
            type: DataTypes.ENUM('blog'),
            allowNull: false,
        },
        against_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
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

        tableName: 'attachments'
    });

    return Attachment;
}