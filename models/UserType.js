'use strict';

module.exports = function (sequelize, DataTypes) {

    const UserType = sequelize.define('UserType', {

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

        tableName: 'definition_user_types'
    });

    UserType.CONSTANTS = {
        STAFF: 1,
        VISITOR: 2
    }

    return UserType;
}
