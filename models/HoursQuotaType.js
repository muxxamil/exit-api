'use strict';

module.exports = function (sequelize, DataTypes) {

    const HoursQuotaType = sequelize.define('HoursQuotaType', {

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
        tableName: 'definition_hours_quota_types'
    });

    HoursQuotaType.CONSTANTS = {
        1: 'normalHours',
        2: 'boardroomHours',
        3: 'unStaffedHours',

        normalHours: 1,
        boardroomHours: 2,
        unStaffedHours: 3,
    };

    return HoursQuotaType;
}
