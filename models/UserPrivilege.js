'use strict';

module.exports = function (sequelize, DataTypes) {

    const UserPrivilege = sequelize.define('UserPrivilege', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        objectType: {
            type: DataTypes.ENUM('user', 'designation'),
            field: 'object_type',
            allowNull: false,
        },
        objectId: {
            type: DataTypes.INTEGER(11),
            field: 'object_id',
            allowNull: false,
        },
        privilegeId: {
            type: DataTypes.INTEGER(11),
            field: 'privilege_id',
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
        tableName: 'user_privileges'
    });

    UserPrivilege.associate = function (models) {

        UserPrivilege.belongsTo(models.Privilege, {foreignKey: 'privilegeId'});

    };

    return UserPrivilege;
}
