var dotenv            = require('dotenv').config();

/*
 * This file contains all the constants to be used in the entire application.
 */

const config = {};

config.jwtSecret                = 'curwinBusinessAdmin';
config.dateTimeFormat           = 'YYYY-MM-DD HH:mm:ss';
config.dateFormat               = 'YYYY-MM-DD';
config.timeFormat               = 'HH:mm:ss';
config.month                    = 'MMMM';
config.monthAndYear             = 'MMM-YY';
config.amPmTimeFormat           = 'hh:mm A';
config.year                     = 'Y';
config.hour                     = 'HH';
config.resultSetLimit           = 20;
config.offsetValue              = 0;
config.page                     = 0;
config.sortOrder                = {DESC : 'DESC', ASC : 'ASC'};
config.tokenDuration            = '10h';

config.DATE_TIME_FORMATS         = {
    DISPLAY_DATE_TIME_FORMAT: 'DD-MM-YYYY hh:mm:ss A',
};

config.TIMEZONES         = {
    AMERICA_HALIFAX: 'America/Halifax',
};

config.CANCEL_BOOKING_LIMIT_HOURS = 16; 
config.FLAG                     = {
    YES: true,
    NO: false,
};

config.HOURS_QUOTA              = {
    NORMAL_HOURS: 'normalHours',
    PEAK_HOURS: 'peakHours',
    BOARDROOM_HOURS: 'boardroomHours',
    UN_STAFFED_HOURS: 'unStaffedHours',
};

config.HOURS_QUOTA_TITLE              = {
    NORMAL_HOURS: 'Normal Hours',
    PEAK_HOURS: 'Peak Hours',
    BOARDROOM_HOURS: 'Boardroom Hours',
    UN_STAFFED_HOURS: 'UnStaffed Hours',
};

config.SCHEDULE_REMINDER_EMAIL         = {
    SUBJECT: 'Schedule Reminder',
    FROM: `Scheduler Software <${process.env.EMAIL_FROM}>`,
};

config.EMAIL_IDS                        = {
    SENDER: process.env.EMAIL_FROM,
    RECEPTIONIST: process.env.RECEPTIONIST_EMAIL,
    DEVELOPER: process.env.DEVELOPER_EMAIL,
}

config.SYSTEM                           = {
    USER_ID: -1
}

config.SMTP_CONFIG                      = {
    host: 'smtp.1and1.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: 'muzamil@techstormsolutions.com',
        pass: 'shani4805530'
    }
};

module.exports = config;
