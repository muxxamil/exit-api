'use strict';
const _         = require('lodash');

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
            unique : true,
            allowNull: true,
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
        type: {
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

    User.insertIgnoreUser = async (params) => {

        let userResult = await User.getUsers({email: params.email});
        
        if(!_.isEmpty(userResult.rows)) {
            return Promise.resolve(_.first(userResult.rows));
        }

        return User.create(params);
    }

    return User;
}
