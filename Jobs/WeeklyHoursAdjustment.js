'use strict';

const defaults   = require('../config/defaults');
const helper     = require('../helpers/Helper');
const bbPromise  = require('bluebird');
const moment     = require('moment');
const _          = require('lodash');
const {
    UserHoursQuota,
} = require('../models');

const weeklyHoursAdjustment = {};

weeklyHoursAdjustment.run = async () => {

    try {
        
        let startOfWeek = moment.utc().tz(defaults.TIMEZONES.AMERICA_HALIFAX).startOf('week').add(1, 'days').startOf('day').tz(defaults.TIMEZONES.AMERICA_HALIFAX).valueOf();
        let endOfWeek = moment.utc().tz(defaults.TIMEZONES.AMERICA_HALIFAX).endOf('week').add(1, 'days').endOf('day').tz(defaults.TIMEZONES.AMERICA_HALIFAX).valueOf();

    } catch (error) {
        const errorObj = new Error();
        errorObj.message = error.message;
        return bbPromise.reject(errorObj);
    }

};

module.exports = weeklyHoursAdjustment;
