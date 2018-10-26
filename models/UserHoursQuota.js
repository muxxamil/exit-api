'use strict';
const defaults  = require('../config/defaults');
const sequelize = require('sequelize');
const bbPromise = require('bluebird');
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
              allowNull: true,
          },
          updatedBy: {
              type: DataTypes.INTEGER(11),
              field: 'updated_by',
              allowNull: true,
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
        UserHoursQuota.belongsTo(models.User, {foreignKey: 'userId'});

    };

    UserHoursQuota.formatWeeklyAndMonthlyQuota = async (data, userId) => {
      let formatedData  = {
          monthlyQuota: {
            normalHours: 0,
            boardroomHours: 0,
            unStaffedHours: 0,
        },
        weeklyQuota: {
          normalHours: 0,
          boardroomHours: 0,
          unStaffedHours: 0,
        }
      };
      let startOfWeek   = moment.utc().startOf("week").add(1, 'days').utc().valueOf();
      let endOfWeek     = moment.utc().endOf("week").add(1, 'days').utc().valueOf();

      let userInfo = await sequelize.models.User.findOne({
        attributes: ['id', 'designationId'],
        where: {
          id: userId
        }
      });
      
      let weeklyBookingPromise = sequelize.models.RentalLocation.getBookings(
        {
          from: startOfWeek,
          to: endOfWeek,
          userId: userId
        });

      let weeklyLimitHoursQuotaPromise = sequelize.models.DesignationHoursQuotaSet.findOne({
          where: {
              designationId: userInfo.designationId,
          }
      });

      let [weeklyBooking, weeklyLimitHoursQuota] = await bbPromise.all([weeklyBookingPromise, weeklyLimitHoursQuotaPromise]);
      let weeklyHoursUsed = _.groupBy(weeklyBooking, 'quotaType');
      let weeklyHoursUsageSum = {};
      _.forEach(weeklyHoursUsed, function(value, key) {
        weeklyHoursUsageSum[key] = _.sumBy(value, 'duration');
      });

      let formattedUserQuota = _.groupBy(data, "typeId");
      let defaultQuotaSet = _.first(formattedUserQuota[sequelize.models.QuotaType.CONSTANTS.DEFAULT]);
      let extendedHours = _.first(formattedUserQuota[sequelize.models.QuotaType.CONSTANTS.EXTENSION]);

      formatedData.weeklyQuota.normalHours = weeklyLimitHoursQuota.normalHours;
      formatedData.weeklyQuota.boardroomHours = weeklyLimitHoursQuota.boardroomHours;
      formatedData.weeklyQuota.unStaffedHours = weeklyLimitHoursQuota.unStaffedHours;

      if(!_.isEmpty(defaultQuotaSet)) {
        
        formatedData.monthlyQuota.normalHours    = defaultQuotaSet.normalHours;
        formatedData.monthlyQuota.boardroomHours = defaultQuotaSet.boardroomHours;
        formatedData.monthlyQuota.unStaffedHours = defaultQuotaSet.unStaffedHours;
        formatedData.monthlyQuota.expiry         = defaultQuotaSet.expiry;

        if(formatedData.weeklyQuota.normalHours > formatedData.monthlyQuota.normalHours) {
          formatedData.weeklyQuota.normalHours = formatedData.monthlyQuota.normalHours;
        }

        if(formatedData.weeklyQuota.boardroomHours > formatedData.monthlyQuota.boardroomHours) {
          formatedData.weeklyQuota.boardroomHours = formatedData.monthlyQuota.boardroomHours;
        }

        if(formatedData.weeklyQuota.unStaffedHours > formatedData.monthlyQuota.unStaffedHours) {
          formatedData.weeklyQuota.unStaffedHours = formatedData.monthlyQuota.unStaffedHours;
        }

      } else {
        formatedData.weeklyQuota.normalHours    = 0;
        formatedData.weeklyQuota.boardroomHours = 0;
        formatedData.weeklyQuota.unStaffedHours = 0;
      }

      if(weeklyHoursUsageSum[sequelize.models.HoursQuotaType.CONSTANTS.normalHours]) {
        formatedData.weeklyQuota.normalHours -= weeklyHoursUsageSum[sequelize.models.HoursQuotaType.CONSTANTS.normalHours];
        if(formatedData.weeklyQuota.normalHours < 0) {
          formatedData.weeklyQuota.normalHours = 0;
        }
      }

      if(weeklyHoursUsageSum[sequelize.models.HoursQuotaType.CONSTANTS.boardroomHours]) {
        formatedData.weeklyQuota.boardroomHours -= weeklyHoursUsageSum[sequelize.models.HoursQuotaType.CONSTANTS.boardroomHours];
        if(formatedData.weeklyQuota.boardroomHours < 0) {
          formatedData.weeklyQuota.boardroomHours = 0;
        }
      }

      if(weeklyHoursUsageSum[sequelize.models.HoursQuotaType.CONSTANTS.unStaffedHours]) {
        formatedData.weeklyQuota.unStaffedHours -= weeklyHoursUsageSum[sequelize.models.HoursQuotaType.CONSTANTS.unStaffedHours];
        if(formatedData.weeklyQuota.unStaffedHours < 0) {
          formatedData.weeklyQuota.unStaffedHours = 0;
        }
      }

      if(!_.isEmpty(extendedHours)) {
        formatedData.weeklyQuota.normalHours += extendedHours.normalHours;
        formatedData.weeklyQuota.boardroomHours += extendedHours.boardroomHours;
        formatedData.weeklyQuota.unStaffedHours += extendedHours.unStaffedHours;
        formatedData.weeklyQuota.expiry          = extendedHours.expiry;
      }

      let finalResult = {};
      finalResult[userId] = formatedData;

      return finalResult;
    }

    UserHoursQuota.getQuota = (params) => {
      let whereClause = UserHoursQuota.getRawParams(params);
      whereClause.expiry = {[Op.gte]: moment.utc().format(defaults.dateTimeFormat)};
      if(whereClause.expiry) {
        whereClause.expiry = {[Op.gte]: moment(whereClause.expiry).format(defaults.dateTimeFormat)};
      }
      // whereClause.expiry = {[Op.gte]: moment.utc().format(defaults.dateTimeFormat)};
      return UserHoursQuota.findAndCountAll({
        where: whereClause,
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
