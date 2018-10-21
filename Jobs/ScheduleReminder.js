'use strict';

const defaults  = require('../config/defaults');
const moment    = require('moment');
const sendmail  = require('sendmail')();
const _         = require('lodash');
const {
    LocationBooking
} = require('../models');

const ScheduleReminder = {};

ScheduleReminder.run = async () => {
    
    const params = {
        fromGte: moment.utc().subtract(25, 'hours').valueOf(),
        fromLte: moment.utc().valueOf(),
    };

    let upcomingLocations = await LocationBooking.getLocationBookings(params);
    upcomingLocations = upcomingLocations.rows;

    let html = "";

    for (let index = 0; index < upcomingLocations.length; index++) {
        html += `${upcomingLocations[index].RentalLocation.title}
        <br/>
        <br/>
        From: ${moment(upcomingLocations[index].from).tz(defaults.TIMEZONES.AMERICA_HALIFAX).format(defaults.DATE_TIME_FORMATS.DISPLAY_DATE_TIME_FORMAT)}<br/>
        To: ${moment(upcomingLocations[index].from).tz(defaults.TIMEZONES.AMERICA_HALIFAX).format(defaults.DATE_TIME_FORMATS.DISPLAY_DATE_TIME_FORMAT)}<br/>
        By: ${upcomingLocations[index].User.firstName} ${upcomingLocations[index].User.lastName} (${upcomingLocations[index].User.email}, ${upcomingLocations[index].User.cell})<br/>
        --------------------------------------------------
        <br/>
        <br/>`;
    }

    sendmail({
        from: defaults.SCHEDULE_REMINDER_EMAIL.FROM,
        to: defaults.SCHEDULE_REMINDER_EMAIL.TO,
        subject: defaults.SCHEDULE_REMINDER_EMAIL.SUBJECT,
        html: html,
    }, function(err, reply) {
    });
};

module.exports = ScheduleReminder;
