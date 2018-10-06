'use strict';

module.exports = function (sequelize, DataTypes) {

    const QuotaType = sequelize.define('QuotaType', {

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
        addedBy: {
            type: DataTypes.INTEGER(11),
            field: 'added_by',
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
        tableName: 'definition_quota_types'
    });

    QuotaType.CONSTANTS = {
        DEFAULT: 1,
        EXTENSION: 2
    }

    return QuotaType;
}
