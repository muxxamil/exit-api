'use strict';

const defaults  = require('../config/defaults');
const _         = require('lodash');
const sequelize = require('sequelize');
const bbPromise = require('bluebird');
const moment    = require('moment-timezone');
const Op        = sequelize.Op;
const {
    RentalLocation,
    OfficeLocation,
    StaffedHour,
    UserHoursQuota,
    LocationBooking,
} = require('../models');

const LocationBookingsMiddleware = {};

LocationBookingsMiddleware.add = async (req, res, next) => {
    try {
        let errorMessages = [];

        if(_.isEmpty(req.body.from)) {
            errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.FROM);
        } else if(moment(req.body.from).diff(moment()) < 0) {
            errorMessages.push(req.app.locals.translation.CONSTRAINTS.TIME_FROM_LESS_THAN_CURRENT);
        }

        if(_.isEmpty(req.body.to)) {
            errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.TO);
        }

        if(_.isEmpty(req.body.timezone)) {
            errorMessages.push(req.app.locals.translation.CONSTRAINTS.TIMEZONE_NOT_DETECTED);
        }

        if(_.isEmpty(req.body.bookingForDate)) {
            errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.BOOKING_FOR_DATE);
        }

        if(!_.isEmpty(req.body.from) && !_.isEmpty(req.body.to) &&
        (moment(moment.utc(parseInt(req.body.to)).format(defaults.dateTimeFormat)).diff((moment(moment.utc(parseInt(req.body.from)).format(defaults.dateTimeFormat))))) <= 0) {
            errorMessages.push(req.app.locals.translation.CONSTRAINTS.TIME_TO_LESS_THAN_TIME_FROM);
        }
        
        if(_.isEmpty(errorMessages)) {
            let rentalLocationPromise = RentalLocation.getDetailedRentalLocation(req.params.id);

            let userQuotaPromise = UserHoursQuota.findOne({
                where: {
                    userId: req.user.id,
                    expiry: {[Op.gte]: moment().format(defaults.dateTimeFormat)}
                }
            });

            let [rentalLocation, userQuota] = await bbPromise.all([rentalLocationPromise, userQuotaPromise]);
    
            if(_.isEmpty(userQuota)) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.INSUFFICIENT_QUOTA);
                return res.status(400).send({ error: errorMessages });
            }
            console.log("\n\n\n\n\n");

            let staffedHoursArr = (!_.isEmpty(rentalLocation.StaffedHours)) ? _.keyBy(rentalLocation.StaffedHours, 'dayNumber') : _.keyBy(rentalLocation.OfficeLocation.StaffedHours, 'dayNumber');
            let dayNumber = moment.utc(parseInt(req.body.to)).day();
            let peakHours = (!_.isEmpty(staffedHoursArr[dayNumber].peakHours)) ? JSON.parse(staffedHoursArr[dayNumber].peakHours) : [];
            
            let staffedHourStart = moment(req.body.bookingForDate + ' ' + staffedHoursArr[dayNumber]['from'], defaults.dateTimeFormat);
            let staffedHourEnd   = moment(req.body.bookingForDate + ' ' + staffedHoursArr[dayNumber]['to'], defaults.dateTimeFormat);
            
            console.log("\n\n\n\n\n");
            console.log("staffedHourEnd", JSON.stringify(staffedHourEnd));
            console.log("staffedHourStart", JSON.stringify(staffedHourStart));
            console.log("moment(req.body.to, defaults.dateTimeFormat)", JSON.stringify(moment.utc(parseInt(req.body.to))));
            console.log("staffedHoursArr[dayNumber].timeZone", JSON.stringify(staffedHoursArr[dayNumber].timeZone));
            console.log("moment(req.body.to, defaults.dateTimeFormat)", JSON.stringify(moment.utc(parseInt(req.body.to)).tz(staffedHoursArr[dayNumber].timeZone).format(defaults.dateTimeFormat)));
            console.log("moment(parseInt(req.body.from), defaults.dateTimeFormat)", JSON.stringify(moment.utc(parseInt(req.body.from), defaults.dateTimeFormat).tz(staffedHoursArr[dayNumber].timeZone)));
            
            let isUnstaffedSchedule = (
                (moment(moment.utc(parseInt(req.body.to)).tz(staffedHoursArr[dayNumber].timeZone).format(defaults.dateTimeFormat)).diff(moment(staffedHourEnd)) > 0) || 
                (moment(moment.utc(parseInt(req.body.from)).tz(staffedHoursArr[dayNumber].timeZone).format(defaults.dateTimeFormat)).diff(moment(staffedHourStart)) < 0) 
            ) ? true : false;
            let bookingHours = moment.duration(moment(moment.utc(parseInt(req.body.to)).format(defaults.dateTimeFormat)).diff(moment(moment.utc(parseInt(req.body.from)).format(defaults.dateTimeFormat)))).asHours();
            let quotaKey     = (isUnstaffedSchedule) ? defaults.HOURS_QUOTA.UN_STAFFED_HOURS : defaults.HOURS_QUOTA.NORMAL_HOURS;

            if(!rentalLocation.unStaffedHours && isUnstaffedSchedule) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.LOCATION_IS_NOT_FOR_UNSTAFFED_HOURS);
            }

            if(rentalLocation.boardroomHours == defaults.FLAG.YES) {
                quotaKey = defaults.HOURS_QUOTA.BOARDROOM_HOURS
            }

            req.body.peakHoursDeduction = 0;
            
            if(quotaKey == defaults.HOURS_QUOTA.NORMAL_HOURS) {
                for (let index = 0; index < peakHours.length; index++) {
                    peakHours[index].from   = req.body.bookingForDate + " " + peakHours[index].from;
                    peakHours[index].to     = req.body.bookingForDate + " " + peakHours[index].to;

                    let peakFrom = moment(peakHours[index].from).format(defaults.dateTimeFormat);
                    let peakTo   = moment(peakHours[index].to).format(defaults.dateTimeFormat);

                    let bookingFrom = moment(moment.utc(parseInt(req.body.from)).tz(staffedHoursArr[dayNumber].timeZone).format(defaults.dateTimeFormat));
                    let bookingTo = moment(moment.utc(parseInt(req.body.to)).tz(staffedHoursArr[dayNumber].timeZone).format(defaults.dateTimeFormat));
                    // let bookingTo   = moment(req.body.to);

                    let isPeakSchedule = (
                        (
                            (moment(peakFrom).diff(bookingFrom) <= 0) && 
                            (moment(peakTo).diff(bookingFrom) >= 0) 
                        ) 
                        || 
                        (
                            (moment(peakFrom).diff(bookingFrom) >= 0) && 
                            (moment(peakFrom).diff(bookingTo) <= 0) 
                        )
                    ) ? true : false;

                    if(isPeakSchedule) {
                        let diffFrom = (moment(peakFrom).diff(bookingFrom) >= 0) ? peakFrom : bookingFrom;
                        let diffTo = (moment(peakTo).diff(bookingTo) <= 0) ? peakTo : bookingTo;

                        req.body.peakHoursDeduction += moment.duration(moment(diffTo).diff(moment(diffFrom))).asHours();
                    }
                }
                bookingHours -= req.body.peakHoursDeduction;

                if(!_.isEmpty(userQuota) && userQuota[quotaKey] < bookingHours && 
                (userQuota[defaults.HOURS_QUOTA.PEAK_HOURS] - req.body.peakHoursDeduction) >= (bookingHours - userQuota[quotaKey])) {
                    req.body.peakHoursDeduction += (bookingHours - userQuota[quotaKey]);
                    bookingHours -= (bookingHours - userQuota[quotaKey]);
                }

                if(rentalLocation.quotaImpact && (_.isEmpty(userQuota) || userQuota[defaults.HOURS_QUOTA.PEAK_HOURS] < req.body.peakHoursDeduction)) {
                    errorMessages.push(req.app.locals.translation.CONSTRAINTS.INSUFFICIENT_QUOTA);
                }

                req.body.peakHoursAfterDeduction = userQuota[defaults.HOURS_QUOTA.PEAK_HOURS] - req.body.peakHoursDeduction;
            }

            req.body.active       = defaults.FLAG.YES;
            req.body.bookedBy     = req.user.id;
            req.body.quotaImpact  = rentalLocation.quotaImpact;
            req.body.quotaKey     = quotaKey;
            req.body.bookingHours = bookingHours;

            console.log("\n\n\n\n\n");

            console.log("req.body", JSON.stringify(req.body));

            console.log("\n\n\n\n\n");
            
            console.log("userQuota", JSON.stringify(userQuota));
            if(rentalLocation.quotaImpact && (_.isEmpty(userQuota) || userQuota[quotaKey] < bookingHours)) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.INSUFFICIENT_QUOTA);
            } else if(rentalLocation.quotaImpact) {
                req.body.quotaAfterDeduction = userQuota[quotaKey] - bookingHours;
            }

            let existingBooking = await LocationBooking.getLocationBookingBetweenDateRanges({ startDate: req.body.from, endDate: req.body.to , rentalLocationId: req.params.id});

            if(!_.isEmpty(existingBooking)) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.BOOKING_ALREADY_EXIST);
            }
        }

        if(!_.isEmpty(errorMessages)) {
            return res.status(400).send({ error: errorMessages });
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = LocationBookingsMiddleware;
