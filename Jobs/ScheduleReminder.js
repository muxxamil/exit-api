'use strict';

const defaults   = require('../config/defaults');
const helper     = require('../helpers/Helper');
const bbPromise  = require('bluebird');
const moment     = require('moment');
const nodemailer = require('nodemailer');
const _          = require('lodash');
const {
    LocationBooking,
    Message,
} = require('../models');

const ScheduleReminder = {};

ScheduleReminder.run = async () => {

    try {
        const params = {
            fromGte: moment.utc().valueOf(),
            fromLte: moment.utc().add(25, 'hours').valueOf(),
        };
    
        let upcomingBookings = await LocationBooking.getLocationBookings(params);
        upcomingBookings = upcomingBookings.rows;
    
        if(_.isEmpty(upcomingBookings)) {
            return;
        }
    
        const bookingIds = _.map(upcomingBookings, 'id');
    
        let alreadyRemindedBookings = await Message.findAll({
            where: {
                againstId: bookingIds,
                againstType: Message.CONSTANTS.AGAINST_TYPE.BOOKING,
                type: Message.CONSTANTS.TYPE.EMAIL,
                added_by: defaults.SYSTEM.USER_ID,
            },
            attributes: ['id', 'againstId']
        });
    
        alreadyRemindedBookings = _.keyBy(alreadyRemindedBookings, 'againstId');
    
        let reminderBookingArr = [];
        let sendEmailPromiseArr = [];
        let valuesToReplaceArr = [];

        let transporter = nodemailer.createTransport(defaults.SMTP_CONFIG);
    
        for (let index = 0; index < upcomingBookings.length; index++) {
            if(!alreadyRemindedBookings[upcomingBookings[index].id]) {
                
                valuesToReplaceArr = [
                    {
                        name: '{{name}}',
                        value: `${upcomingBookings[index].User.firstName} ${(upcomingBookings[index].User.lastName) ? upcomingBookings[index].User.lastName : ''}`
                    },
                    {
                        name: '{{date}}',
                        value: `${moment(upcomingBookings[index].from).tz(defaults.TIMEZONES.AMERICA_HALIFAX).format(defaults.DATE_TIME_FORMATS.DISPLAY_DATE_FORMAT)}`
                    },
                    {
                        name: '{{startTime}}',
                        value: `${moment(upcomingBookings[index].from).tz(defaults.TIMEZONES.AMERICA_HALIFAX).format(defaults.DATE_TIME_FORMATS.DISPLAY_TIME_FORMAT)}`
                    },
                    {
                        name: '{{endTime}}',
                        value: `${moment(upcomingBookings[index].to).tz(defaults.TIMEZONES.AMERICA_HALIFAX).format(defaults.DATE_TIME_FORMATS.DISPLAY_TIME_FORMAT)}`
                    }
                ];

                let tempHtml = helper.replaceStringValues(defaults.SCHEDULE_REMINDER_EMAIL.CONTENT, valuesToReplaceArr);

                let mailOptions = {
                    from: defaults.SCHEDULE_REMINDER_EMAIL.FROM,
                    to: upcomingBookings[index].User.email,
                    subject: defaults.SCHEDULE_REMINDER_EMAIL.SUBJECT,
                    html: helper.replaceStringValues(defaults.SCHEDULE_REMINDER_EMAIL.CONTENT, valuesToReplaceArr)
                };

                console.log("\n\n\n");
                console.log("mailOptions", mailOptions);
                console.log("\n\n\n");

                sendEmailPromiseArr.push(transporter.sendMail(mailOptions));

                reminderBookingArr.push({
                    type: Message.CONSTANTS.TYPE.EMAIL,
                    againstType: Message.CONSTANTS.AGAINST_TYPE.BOOKING,
                    againstId: upcomingBookings[index].id,
                    content: tempHtml,
                    addedBy: defaults.SYSTEM.USER_ID
                });
            }
        }
    
        if(_.isEmpty(sendEmailPromiseArr)) {
            await bbPromise.all([...sendEmailPromiseArr, Message.bulkCreate(reminderBookingArr)]);
            return;
        }

    } catch (error) {
        const errorObj = new Error();
        errorObj.message = error.message;
        return bbPromise.reject(errorObj);
    }

};

module.exports = ScheduleReminder;
