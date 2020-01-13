'use strict';
const _         = require('lodash');
const bbPromise = require('bluebird');
const moment    = require('moment');
const defaults  = require('../config/defaults');

module.exports = function (sequelize, DataTypes) {

    const User = sequelize.define('User', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING(100),
            field: 'first_name',
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(100),
            field: 'last_name',
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
        designationId: {
            type: DataTypes.INTEGER(11),
            field: 'designation_id',
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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

    User.associate = function (models) {

    };

    User.getUsers = (params) => {

        let options = {};
        // options = User.setPagination(params);
        options.where = User.getRawParams(params);
        options.subQuery = false;
        let countPromise = User.find({
            attributes: [ [ sequelize.literal('count(*)'), 'count' ] ],
            subQuery: false,
            raw: true,
            where: _.clone(options.where)
        });
        options.order = [['id', defaults.sortOrder.DESC]];
        let dataPromise = User.findAll(options);
        return {
            dataPromise: dataPromise,
            countPromise: countPromise
        }
    }

    User.createNewUser = async (params) => {
        return User.create(User.getRawParams(params));
    }
    // User.insertIgnoreUser = async (params) => {

    //     let userResult = await User.getUsers({email: params.email});
        
    //     if(!_.isEmpty(userResult.rows)) {
    //         return Promise.resolve(_.first(userResult.rows));
    //     }

    //     return User.create(params);
    // }

    return User;
}
