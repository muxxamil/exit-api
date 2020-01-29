'use strict';
const _             = require('lodash');
const bbPromise     = require('bluebird');
const defaults      = require('../config/defaults');
const helper         = require('../helpers/Helper');
const sequelize     = require('sequelize');
const Op            = sequelize.Op;

module.exports = function (sequelize, DataTypes) {

    const Agent = sequelize.define('Agent', {

        id: {
            type: DataTypes.INTEGER(11),
            field: 'agent_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            field: 'agent_name',
            allowNull: false,
        },
        designation: {
            type: DataTypes.STRING(255),
            field: 'agent_designation',
        },
        email: {
            type: DataTypes.STRING(255),
            field: 'agent_email',
        },
        address: {
            type: DataTypes.STRING(255),
            field: 'agent_address',
        },
        bio: {
            type: DataTypes.TEXT,
            field: 'agent_bio',
        },
        profile: {
            type: DataTypes.STRING(255),
            field: 'agent_profile',
        },
        phone: {
            type: DataTypes.STRING(40),
            field: 'agent_phone',
        },
        otherPhone: {
            type: DataTypes.STRING(40),
            field: 'other_phone',
        },
        website: {
            type: DataTypes.STRING(100),
        },
        facebook: {
            type: DataTypes.STRING(255),
        },
        linkdin: {
            type: DataTypes.STRING(255),
        },
        insta: {
            type: DataTypes.STRING(255),
        },
        twitter: {
            type: DataTypes.STRING(100),
        },
        active: {
            type: DataTypes.INTEGER(1),
        },
        order: {
            type: DataTypes.INTEGER(11),
            field: 'display_order',
            allowNull: false,
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
        tableName: 'agents'
    });

    Agent.updateDisplayOrder = async () => {
        const maxOrder = await Agent.max('order');
        return sequelize.query(`UPDATE agents SET display_order =
        CASE display_order
          WHEN ${maxOrder} THEN 1
          ELSE display_order + 1
        END;`);
    }

    return Agent;
}
