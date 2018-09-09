'use strict';

module.exports = function (sequelize, DataTypes) {

    const UserDesignation = sequelize.define('UserDesignation', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        displayOrder: {
            type: DataTypes.INTEGER(11),
            field: 'display_order',
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

        tableName: 'definition_user_designations'
    });

    UserDesignation.CONSTANTS = {
        CEO: 1,
        VISITOR: 2,
        RECEP: 3
    }

    return UserDesignation;
}
