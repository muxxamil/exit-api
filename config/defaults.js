
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

module.exports = config;
