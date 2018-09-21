'use strict';

const defaults  = require('../config/defaults');
const _         = require('lodash');
const sequelize = require('sequelize');
const bbPromise = require('bluebird');
const moment    = require('moment');
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
    let errorMessages = [];

    if(_.isEmpty(req.body.from)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.FROM);
    } else if(moment(req.body.from).diff(moment()) < 0) {
        errorMessages.push(req.app.locals.translation.CONSTRAINTS.TIME_FROM_LESS_THAN_CURRENT);
    }

    if(_.isEmpty(req.body.to)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.TO);
    }

    if(_.isEmpty(req.body.bookingForDate)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.BOOKING_FOR_DATE);
    }
    
    if(!_.isEmpty(req.body.from) && !_.isEmpty(req.body.to) && moment(req.body.to).diff(moment(req.body.from)) <= 0) {
        errorMessages.push(req.app.locals.translation.CONSTRAINTS.TIME_TO_LESS_THAN_TIME_FROM);
    }
    
    if(_.isEmpty(errorMessages)) {
        let rentalLocationPromise = RentalLocation.findOne({
            include: [
                {
                    model: OfficeLocation,
                    attributes: ['id'],
                    required: true,
                    include: [
                        {
                            required: true,
                            model: StaffedHour
                        }
                    ]
                },
                {
                    model: StaffedHour
                }
            ],
            where: {
                id: req.params.id
            }
        });

        let userQuotaPromise = UserHoursQuota.findOne({
            where: {
                userId: req.user.id,
                expiry: {[Op.gte]: moment().format(defaults.dateTimeFormat)}
            }
        });

        let [rentalLocation, userQuota] = await bbPromise.all([rentalLocationPromise, userQuotaPromise]);

        let staffedHoursArr = (!_.isEmpty(rentalLocation.StaffedHours)) ? _.keyBy(rentalLocation.StaffedHours, 'dayNumber') : _.keyBy(rentalLocation.OfficeLocation.StaffedHours, 'dayNumber');
        let dayNumber = moment(req.body.to).day();

        let staffedHourStart = req.body.bookingForDate + ' ' + staffedHoursArr[dayNumber]['from'];
        let staffedHourEnd   = req.body.bookingForDate + ' ' + staffedHoursArr[dayNumber]['to'];
        
        console.log("\n\n\n\n\n");

        console.log("dayNumber", dayNumber);
        console.log("req.body", req.body);
        console.log("moment(req.body.from)", moment(req.body.from));
        console.log("staffedHourStart", staffedHourStart);
        console.log("req.body.to", req.body.to);
        console.log("moment(req.body.to)", moment(req.body.to));
        console.log("staffedHourEnd", staffedHourEnd);
        console.log("moment(staffedHourStart).format(defaults.dateTimeFormat)", moment(staffedHourStart).format(defaults.dateTimeFormat));

        let isUnstaffedSchedule = (
            (moment(req.body.to).diff(moment(staffedHourEnd).format(defaults.dateTimeFormat)) > 0) || 
            (moment(req.body.from).diff(moment(staffedHourStart).format(defaults.dateTimeFormat)) < 0) 
        ) ? true : false;
        let bookingHours = moment.duration(moment(req.body.to).diff(moment(req.body.from))).asHours();
        let quotaKey     = (isUnstaffedSchedule) ? 'unStaffedHours' : 'staffedHours';
        req.body.active       = defaults.FLAG.YES;
        req.body.bookedBy     = req.user.id;
        req.body.quotaImpact  = rentalLocation.quotaImpact;
        req.body.quotaKey     = quotaKey;
        req.body.bookingHours = bookingHours;

        console.log("userQuota[quotaKey]", userQuota[quotaKey]);
        console.log("bookingHours", bookingHours);
        console.log("\n\n\n\n\n");
        
        if(!rentalLocation.unStaffedHours && isUnstaffedSchedule) {
            errorMessages.push(req.app.locals.translation.CONSTRAINTS.LOCATION_IS_NOT_FOR_UNSTAFFED_HOURS);
        }
        
        if(rentalLocation.quotaImpact && (_.isEmpty(userQuota) || userQuota[quotaKey] < bookingHours)) {
            errorMessages.push(req.app.locals.translation.CONSTRAINTS.INSUFFICIENT_QUOTA);
        } else {
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
};

module.exports = LocationBookingsMiddleware;
