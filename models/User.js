'use strict';

module.exports = function (sequelize, DataTypes) {

    const User = sequelize.define('User', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        cell: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        latitude: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        longitude: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        addedBy: {
            type: DataTypes.INTEGER(11),
            field: 'added_by'
        },
        updatedBy: {
            type: DataTypes.INTEGER(11),
            field: 'updated_by'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    }, {

        tableName: 'users'
    });

    User.getUsers = (params) => {

        let options = {};
        options = User.setPagination(params);
        options.attributes = { exclude: ['password'] };
        options.where = User.getRawParams(params);
        return User.findAndCountAll(options);

    }

    return User;
}
