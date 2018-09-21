'use strict';

module.exports = function (sequelize, DataTypes) {

    const OfficeLocation = sequelize.define('OfficeLocation', {


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
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
    },
    {
        tableName: 'office_locations'
    });

    OfficeLocation.associate = function (models) {
        OfficeLocation.hasMany(models.StaffedHour, {foreignKey: 'objectId', scope: { object_type: ['office'] }});
    };

    return OfficeLocation;
}