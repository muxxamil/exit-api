-'use strict';

module.exports = function (sequelize, DataTypes) {

    const Privilege = sequelize.define('Privilege', {

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
            type: DataTypes.STRING(100),
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

        tableName: 'definition_privileges'
    });

    Privilege.CONSTANTS = {
        CAN_SEE_DASHBOARD: "CSD",
        CAN_MANAGE_USERS: "CMU",
        CAN_MANAGE_BLOG: "CMB",
        CAN_MANAGE_SCHEDULE: "CMS",
        CAN_MANAGE_MY_SCHEDULE: "CMMS",
        CAN_MANAGE_ALL_SCHEDULE: "CMAS",
        CAN_CANCEL_BOOKING_ANYTIME: "CCBA",
        CAN_CANCEL_ALL_BOOKING: "CCAB",
        CAN_RESET_MY_PASSWORD: "CRMP",
        CAN_RESET_ALL_PASSWORD: "CRAP",
        CAN_CHANGE_ALL_USER_QUOTA: "CCAUQ",
        CAN_BOOK_LOCATION_FOR_ALL_USERS: "CBLFAU",
    }

    return Privilege;
}
