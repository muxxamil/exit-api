'use strict';
const defaults  = require('../config/defaults');
const sequelize = require('sequelize');
const moment    = require('moment');
const _         = require('lodash');
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
          typeId: {
            type: DataTypes.INTEGER(11),
            field: 'type_id',
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

    UserHoursQuota.associate = function (models) {

        UserHoursQuota.belongsTo(models.QuotaType, {foreignKey: 'typeId'});

    };

    UserHoursQuota.getQuota = (params) => {
      let whereClause = UserHoursQuota.getRawParams(params);
      whereClause.expiry = {[Op.gte]: moment().format(defaults.dateTimeFormat)}
      return UserHoursQuota.findAndCountAll({
        where: UserHoursQuota.getRawParams(params),
        order: [['typeId', defaults.sortOrder.ASC]]
      });
    }

    /* UserHoursQuota.deductQuota = (params) => {
      let updateValues = {};
      updateValues[params.quotaType] = params.quotaAfterDeduction;
      updateValues[params.updatedBy] = params.userId;
      return UserHoursQuota.update(updateValues, {where: { userId: params.userId }});
    } */

    UserHoursQuota.setQuotaExtension = async (params) => {
      let alreadyExtesion = await UserHoursQuota.findOne({
        where: {
          userId: params.userId,
          typeId: sequelize.models.QuotaType.CONSTANTS.EXTENSION,
          expiry: moment(moment.utc().endOf("week").add(1, 'days').valueOf()).format(defaults.dateTimeFormat)
        }
      });

      if(!_.isEmpty(alreadyExtesion)) {
        let options = {
          normalHours: params.normalHours,
          boardroomHours: params.boardroomHours,
          unStaffedHours: params.unStaffedHours,
          updatedBy: params.updatedBy,
        };

        return UserHoursQuota.update(options, {where: {id: alreadyExtesion.id}});
      }

      return UserHoursQuota.create({
        userId: params.userId,
        typeId: sequelize.models.QuotaType.CONSTANTS.EXTENSION,
        normalHours: params.normalHours,
        boardroomHours: params.boardroomHours,
        unStaffedHours: params.unStaffedHours,
        updatedBy: params.updatedBy,
        addedBy: params.updatedBy,
        expiry: moment.utc().endOf("week").add(1, 'days')
      });
    }
    UserHoursQuota.createUserQuota = (params) => {
      return UserHoursQuota.create(UserHoursQuota.getRawParams(params))
    }

    return UserHoursQuota;
}
