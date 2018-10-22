'use strict';

const defaults   = require('../config/defaults');
const moment     = require('moment');
const nodemailer = require('nodemailer');
const _          = require('lodash');
const {
    LocationBooking,
    Message,
} = require('../models');

const ScheduleReminder = {};

ScheduleReminder.run = async () => {
    
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

    let html = "";
    let reminderBookingArr = [];

    for (let index = 0; index < upcomingBookings.length; index++) {
        if(!alreadyRemindedBookings[upcomingBookings[index].id]) {
            let tempHtml = `${upcomingBookings[index].RentalLocation.title}
            <br/>
            <br/>
            From: ${moment(upcomingBookings[index].from).tz(defaults.TIMEZONES.AMERICA_HALIFAX).format(defaults.DATE_TIME_FORMATS.DISPLAY_DATE_TIME_FORMAT)}<br/>
            To: ${moment(upcomingBookings[index].to).tz(defaults.TIMEZONES.AMERICA_HALIFAX).format(defaults.DATE_TIME_FORMATS.DISPLAY_DATE_TIME_FORMAT)}<br/>
            By: ${upcomingBookings[index].User.firstName} ${(upcomingBookings[index].User.lastName) ? upcomingBookings[index].User.lastName : ''} (${upcomingBookings[index].User.email}, ${upcomingBookings[index].User.cell})<br/>
            --------------------------------------------------
            <br/>
            <br/>`;
            html = html.concat(tempHtml);

            reminderBookingArr.push({
                type: Message.CONSTANTS.TYPE.EMAIL,
                againstType: Message.CONSTANTS.AGAINST_TYPE.BOOKING,
                againstId: upcomingBookings[index].id,
                content: tempHtml,
                addedBy: defaults.SYSTEM.USER_ID
            });
        }
    }

    console.log("\n\n html \n\n", html);
    console.log("\n\n reminderBookingArr \n\n", reminderBookingArr);

    if(_.isEmpty(html)) {
        return;
    }

    let transporter = nodemailer.createTransport(defaults.SMTP_CONFIG);

    let mailOptions = {
        from: defaults.SCHEDULE_REMINDER_EMAIL.FROM,
        to: defaults.EMAIL_IDS.RECEPTIONIST,
        subject: defaults.SCHEDULE_REMINDER_EMAIL.SUBJECT,
        html: html
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if(_.isEmpty(error)) {
            await Message.bulkCreate(reminderBookingArr);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

};

module.exports = ScheduleReminder;
