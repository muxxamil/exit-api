'use strict';

module.exports = function (sequelize, DataTypes) {

    const Company = sequelize.define('Company', {

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

        tableName: 'companies'
    });

    Company.CONSTANTS = {
        COMPANIES: {
            EXIT_REALTY_SPECIALISTS: 8,
            EXIT_REALTY_SPECIALISTS_ROTHESAY: 5,
        },
        BOARD: {
            SAINT_JOHN: 84
        }
    }

    return Company;
}
