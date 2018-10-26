'use strict';

const defaults   = require('../config/defaults');
const helper     = require('../helpers/Helper');
const bbPromise  = require('bluebird');
const op         = require('sequelize').Op;
const moment     = require('moment');
const _          = require('lodash');
const {
    UserHoursQuota,
    QuotaType,
    User,
} = require('../models');

const weeklyHoursAdjustment = {};

weeklyHoursAdjustment.run = async () => {

    try {
        
        let startOfWeek = moment.utc().tz(defaults.TIMEZONES.AMERICA_HALIFAX).startOf('week').add(1, 'days').startOf('day').tz(defaults.TIMEZONES.AMERICA_HALIFAX).valueOf();
        let endOfWeek = moment.utc().tz(defaults.TIMEZONES.AMERICA_HALIFAX).endOf('week').add(1, 'days').endOf('day').tz(defaults.TIMEZONES.AMERICA_HALIFAX).valueOf();

        let users = await User.findAll({
            attributes: ['id'],
            where: {
                active: defaults.FLAG.YES
            }
        });

        let userIds = _.map(users, 'id');

        let userHoursQuotaRes = await UserHoursQuota.getQuota({userId: userIds});
        userHoursQuotaRes = userHoursQuotaRes.rows;

        userHoursQuotaRes = _.groupBy(userHoursQuotaRes, 'userId');

        if(_.isEmpty(userHoursQuotaRes)) {
            return;
        }

        let getRemainingHourPromiseArr = [];

        _.forEach(userHoursQuotaRes, function(value, key) {
            getRemainingHourPromiseArr.push(UserHoursQuota.formatWeeklyAndMonthlyQuota(value, key));
        });

        let remainingHours = await bbPromise.all(getRemainingHourPromiseArr);

        let updateQuotaPromiseArr = [];

        _.forEach(remainingHours, function(value) {
            let currentUserId = Object.keys(value)[0];
            let weeklyHours = value[currentUserId].weeklyQuota;

            let defaultHoursQuota = _.first(_.filter(userHoursQuotaRes[currentUserId], {'typeId': QuotaType.CONSTANTS.DEFAULT}));
            let extendedHoursQuota = _.first(_.filter(userHoursQuotaRes[currentUserId], {'typeId': QuotaType.CONSTANTS.EXTENSION}));
console.log("\n\n weeklyHours \n\n", JSON.stringify(weeklyHours));
console.log("\n\n defaultHoursQuota \n\n", JSON.stringify(defaultHoursQuota));
console.log("\n\n extendedHoursQuota \n\n", JSON.stringify(extendedHoursQuota));
            let tempObj = {};

            if(!_.isEmpty(extendedHoursQuota)) {
                weeklyHours.normalHours = (weeklyHours.normalHours > extendedHoursQuota.normalHours) ? weeklyHours.normalHours - extendedHoursQuota.normalHours : 0;
                weeklyHours.boardroomHours = (weeklyHours.boardroomHours > extendedHoursQuota.boardroomHours) ? weeklyHours.boardroomHours - extendedHoursQuota.boardroomHours : 0;
                weeklyHours.unStaffedHours = (weeklyHours.unStaffedHours > extendedHoursQuota.unStaffedHours) ? weeklyHours.unStaffedHours - extendedHoursQuota.unStaffedHours : 0;
            }

            defaultHoursQuota.normalHours = (defaultHoursQuota.normalHours > weeklyHours.normalHours) ? defaultHoursQuota.normalHours - weeklyHours.normalHours : 0;
            defaultHoursQuota.boardroomHours = (defaultHoursQuota.boardroomHours > weeklyHours.boardroomHours) ? defaultHoursQuota.boardroomHours - weeklyHours.boardroomHours : 0;
            defaultHoursQuota.unStaffedHours = (defaultHoursQuota.unStaffedHours > weeklyHours.unStaffedHours) ? defaultHoursQuota.unStaffedHours - weeklyHours.unStaffedHours : 0;
            
            updateQuotaPromiseArr.push(UserHoursQuota.update({
                normalHours: defaultHoursQuota.normalHours,
                boardroomHours: defaultHoursQuota.boardroomHours,
                unStaffedHours: defaultHoursQuota.unStaffedHours,
            }, {where: {id: defaultHoursQuota.id}}));
        });

        return await bbPromise.all(updateQuotaPromiseArr);

    } catch (error) {
        const errorObj = new Error();
        errorObj.message = error.message;
        return bbPromise.reject(errorObj);
    }

};

module.exports = weeklyHoursAdjustment;
