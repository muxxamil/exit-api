'use strict';

module.exports = function (sequelize, DataTypes) {

    const Message = sequelize.define('Message', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.ENUM('email'),
            allowNull: false,
        },
        againstType: {
            type: DataTypes.ENUM('booking'),
            field: 'against_type',
            allowNull: false,
        },
        againstId: {
            type: DataTypes.INTEGER(11),
            field: 'against_id',
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        response: {
            type: DataTypes.TEXT,
        },
        addedBy: {
            type: DataTypes.TEXT,
            field: 'added_by',
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
        tableName: 'messages'
    });

    Message.CONSTANTS = {
        TYPE: {
            EMAIL: 'email'
        },
        AGAINST_TYPE: {
            BOOKING: 'booking'
        }
    }

    return Message;
}
