var dotenv            = require('dotenv').config();

/*
 * This file contains all the constants to be used in the entire application.
 */

const config = {};

config.jwtSecret                = 'exit-admin-api';
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
    DISPLAY_DATE_FORMAT: 'DD-MM-YYYY',
    DISPLAY_TIME_FORMAT: 'hh:mm:ss A',
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
    CONTENT: `Dear {{name}}<br/><br/>
    This is a reminder that you have office time scheduled for {{date}} from {{startTime}} to {{endTime}} (Timezone: Halifax). If there are any special accommodations you require for your appointment, please inform us ASAP.<br/><br/>
    You can reach us at 506-847-4485, Monday-Saturday 8am-8pm, or by email at info@curwinbusinesscentre.com<br/><br/>
    We look forward to seeing you then!<br/><br/>
    Curwin Business Centre`
};

config.WELCOME_EMAIL                    = {
    SUBJECT: 'Thank You For Signing Up!',
    FROM: `Scheduler Software <${process.env.EMAIL_FROM}>`,
    CONTENT: `Hi {{name}}<br/><br/>
    We are incredibly excited to have you join the Curwin Business Centre!<br/><br/>
    Now, before we can get started on all of the great services we have to offer, could you please call or email our head office so we can help you to set up your account?<br/><br/>
    Our office number is 506-847-4485<br/>
    Email: emily@curwinbusinesscentre.com<br/><br/>
    We look forward to hearing from you soon!`
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
    service: 'gmail',
    auth: {
           user: 'curwinscheduler@gmail.com',
           pass: 'ShaniTara2018!'
       }
   }
// config.SMTP_CONFIG                      = {
//     host: 'smtp.1and1.com',
//     port: 587,
//     secure: false, // upgrade later with STARTTLS
//     auth: {
//         user: 'schedule@curwinbusinesscentre.com',
//         pass: 'ShaniTara2018!'
//     }
// };

module.exports = config;
