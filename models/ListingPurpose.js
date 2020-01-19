'use strict';

module.exports = function (sequelize, DataTypes) {

    const ListingPurpose = sequelize.define('ListingPurpose', {

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
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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

        tableName: 'listing_purposes'
    });

    ListingPurpose.CONSTANTS = {
        PURPOSES: {
            VACANT_LAND: 1
        }
    }

    return ListingPurpose;
}
