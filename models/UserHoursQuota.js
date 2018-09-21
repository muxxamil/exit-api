'use strict';

module.exports = function (sequelize, DataTypes) {

    const UserHoursQuota = sequelize.define('UserHoursQuota', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          userId: {
            type: DataTypes.INTEGER(11),
            field: 'userid',
            allowNull: false,
          },
          staffedHours: {
            type: DataTypes.FLOAT,
            field: 'staffed_hours',
            allowNull: false,
          },
          unStaffedHours: {
            type: DataTypes.FLOAT,
            field: 'un_staffed_hours',
            allowNull: false,
          },
          addedBy: {
              type: DataTypes.INTEGER(11),
              field: 'added_by',
              allowNull: false,
          },
          updatedBy: {
              type: DataTypes.INTEGER(11),
              field: 'updated_by',
              allowNull: false,
          },
          expiry: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'expiry_datetime'
          },
          deleted: {
              type: DataTypes.BOOLEAN,
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

        tableName: 'user_hours_quota'
    });

    UserHoursQuota.deductQuota = (params) => {
      let updateValues = {};
      updateValues[params.quotaType] = params.quotaAfterDeduction;
      updateValues[params.updatedBy] = params.userId;
      return UserHoursQuota.update(updateValues, {where: { userId: params.userId }});
    }

    return UserHoursQuota;
}
