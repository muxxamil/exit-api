'use strict';

module.exports = function (sequelize, DataTypes) {

    const Tag = sequelize.define('Tag', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        title: {
            type: DataTypes.ENUM('ip'),
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
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

        tableName: 'tags'
    });

    Tag.CONSTANTS = {
        ACTIVE: {
            YES: true,
            NO: false,
        }
    }

    return Tag;
}
