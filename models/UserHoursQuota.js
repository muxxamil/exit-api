'use strict';
const defaults  = require('../config/defaults');
const sequelize = require('sequelize');
const moment    = require('moment');
const Op        = sequelize.Op;

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
          normalHours: {
            type: DataTypes.FLOAT,
            field: 'normal_hours',
            defaultValue: 0,
            allowNull: false,
          },
          boardroomHours: {
            type: DataTypes.FLOAT,
            field: 'boardroom_hours',
            defaultValue: 0,
            allowNull: false,
          },
          unStaffedHours: {
            type: DataTypes.FLOAT,
            field: 'un_staffed_hours',
            defaultValue: 0,
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
    }, {

        tableName: 'user_hours_quota'
    });

    UserHoursQuota.getQuota = (params) => {
      let whereClause = UserHoursQuota.getRawParams(params);
      whereClause.expiry = {[Op.gte]: moment().format(defaults.dateTimeFormat)}
      return UserHoursQuota.findAndCountAll({
        where: UserHoursQuota.getRawParams(params)
      });
    }

    UserHoursQuota.deductQuota = (params) => {
      let updateValues = {};
      updateValues[params.quotaType] = params.quotaAfterDeduction;
      updateValues[params.updatedBy] = params.userId;
      return UserHoursQuota.update(updateValues, {where: { userId: params.userId }});
    }

    UserHoursQuota.createUserQuota = (params) => {
      return UserHoursQuota.create(UserHoursQuota.getRawParams(params))
    }

    return UserHoursQuota;
}
