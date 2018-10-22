'use strict';

const defaults  = require('../config/defaults');
const _         = require('lodash');
const sequelize = require('sequelize');
const bbPromise = require('bluebird');
const moment    = require('moment-timezone');
const Op        = sequelize.Op;
const {
    RentalLocation,
    UserHoursQuota,
    LocationBooking,
    HoursQuotaType,
    DesignationHoursQuotaSet,
    Privilege,
    QuotaType,
    User
} = require('../models');

const LocationBookingsMiddleware = {};

LocationBookingsMiddleware.delete = async (req, res, next) => {
    try {
        let errorMessages = [];

        let locationBooking = await LocationBooking.findOne(
            {
                include: [
                    {
                        model: RentalLocation,
                        attributes: ['quotaImpact']
                    }
                ],
                where: {
                    id: req.params.id,
                    deleted: defaults.FLAG.NO
                }
            }
        );

        if(_.isEmpty(locationBooking) || _.isEmpty(locationBooking.RentalLocation)) {
            errorMessages.push(req.app.locals.translation.CONSTRAINTS.BOOKING_DOES_NOT_EXIST);            
            return res.status(400).send({ error: errorMessages });
        }

        if(_.indexOf(req.user.privileges, Privilege.CONSTANTS.CAN_CANCEL_ALL_BOOKING) == -1 && locationBooking.bookedBy != req.user.id) {
            errorMessages.push(req.app.locals.translation.PRIVILEGES.CANNOT_CANCEL_THIS_BOOKING);            
            return res.status(403).send({ error: errorMessages });
        }
        
        
        req.body.bookingHours = locationBooking.duration;
        let hoursLeft = moment.duration(moment(moment.utc(parseInt(locationBooking.from)).format(defaults.dateTimeFormat)).diff(moment(moment.utc().format(defaults.dateTimeFormat)))).asHours();
        if(_.indexOf(req.user.privileges, Privilege.CONSTANTS.CAN_CANCEL_BOOKING_ANYTIME) == -1 && hoursLeft < defaults.CANCEL_BOOKING_LIMIT_HOURS) {
            errorMessages.push(req.app.locals.translation.PRIVILEGES.CANNOT_CANCEL_BOOKING_NOW);            
            return res.status(403).send({ error: errorMessages });
        }

        if(!_.isEmpty(locationBooking.RentalLocation) && locationBooking.RentalLocation.quotaImpact) {
            req.body.updateQuota = true;            
        }

        next();
    } catch (err) {
        next(err);
    }
}

LocationBookingsMiddleware.add = async (req, res, next) => {
    try {
        let errorMessages = [];

        if(moment(moment.utc(parseInt(req.body.to)).format(defaults.dateTimeFormat)).diff(moment().add('14', 'days')) > 0
        && _.indexOf(req.user.privileges, Privilege.CONSTANTS.CAN_BOOK_LOCATION_ANYTIME) == -1) {
            errorMessages.push(req.app.locals.translation.CONSTRAINTS.CANNOT_BOOK_AFTER_14_DAYS);
            return res.status(400).send({ error: errorMessages });
        }

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

        if(req.params.id == RentalLocation.CONSTANTS.LOCATIONS.MARGRET_OFFICE && 
            _.indexOf(req.user.privileges, RentalLocation.CONSTANTS[req.params.id]) == -1) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.CANNOT_BOOK_THIS_OFFICE); 
                return res.status(400).send({ error: errorMessages });
        }

        if(!_.isEmpty(req.body.from) && !_.isEmpty(req.body.to) &&
        (moment(moment.utc(parseInt(req.body.to)).format(defaults.dateTimeFormat)).diff((moment(moment.utc(parseInt(req.body.from)).format(defaults.dateTimeFormat))))) <= 0) {
            errorMessages.push(req.app.locals.translation.CONSTRAINTS.TIME_TO_LESS_THAN_TIME_FROM);
        }

        let userInfo = {id: req.user.id, designationId: req.user.designationId};

        if(req.body.bookingFor) {
            let userDataAndCountPromises = User.getUsers({id: req.body.bookingFor});
            let userRes = await userDataAndCountPromises.dataPromise;
            userInfo = _.first(userRes);
        }
        
        if(_.isEmpty(errorMessages)) {
            let rentalLocationPromise = RentalLocation.getDetailedRentalLocation(req.params.id);

            let weeklyLimitHoursQuotaPromise = DesignationHoursQuotaSet.findOne({
                where: {
                    designationId: userInfo.designationId,
                }
            });

            let startOfWeek = moment.utc(parseInt(req.body.to)).startOf("week").add(1, 'days').utc().valueOf();
            let endOfWeek = moment.utc(parseInt(req.body.to)).endOf("week").add(1, 'days').utc().valueOf();
            
            let [rentalLocation, weeklyLimitHoursQuota] = await bbPromise.all([rentalLocationPromise, weeklyLimitHoursQuotaPromise]);

            if(_.isEmpty(rentalLocation)) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.NO_RENTAL_LOCATION_EXIST);
                return res.status(400).send({ error: errorMessages });
            }
            
            if(!rentalLocation.active) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.CANNOT_BOOK_LOCATION);
                return res.status(400).send({ error: errorMessages });
            }

            let bookingHours = moment.duration(moment(moment.utc(parseInt(req.body.to)).format(defaults.dateTimeFormat)).diff(moment(moment.utc(parseInt(req.body.from)).format(defaults.dateTimeFormat)))).asHours();

            if(bookingHours > 3) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.CANNOT_BOOK_MORE_THAN_3_HOUR);
                return res.status(400).send({ error: errorMessages });
            }

            if(bookingHours < 1) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.CANNOT_BOOK_LESS_THAN_1_HOUR);
                return res.status(400).send({ error: errorMessages });
            }

            let staffedHoursArr = (!_.isEmpty(rentalLocation.StaffedHours)) ? _.keyBy(rentalLocation.StaffedHours, 'dayNumber') : _.keyBy(rentalLocation.OfficeLocation.StaffedHours, 'dayNumber');
            let dayNumber = moment.utc(parseInt(req.body.to)).day();
            // let peakHours = (!_.isEmpty(staffedHoursArr[dayNumber].peakHours)) ? JSON.parse(staffedHoursArr[dayNumber].peakHours) : [];
            
            let staffedHourStart = moment(req.body.bookingForDate + ' ' + staffedHoursArr[dayNumber]['from'], defaults.dateTimeFormat);
            let staffedHourEnd   = moment(req.body.bookingForDate + ' ' + staffedHoursArr[dayNumber]['to'], defaults.dateTimeFormat);
            
            let isUnstaffedSchedule = (
                (moment(moment.utc(parseInt(req.body.to)).tz(staffedHoursArr[dayNumber].timeZone).format(defaults.dateTimeFormat)).diff(moment(staffedHourEnd)) > 0) || 
                (moment(moment.utc(parseInt(req.body.from)).tz(staffedHoursArr[dayNumber].timeZone).format(defaults.dateTimeFormat)).diff(moment(staffedHourStart)) < 0) 
            ) ? true : false;
            
            let quotaKey     = (isUnstaffedSchedule) ? defaults.HOURS_QUOTA.UN_STAFFED_HOURS : defaults.HOURS_QUOTA.NORMAL_HOURS;
            let quotaTitle     = (isUnstaffedSchedule) ? defaults.HOURS_QUOTA_TITLE.UN_STAFFED_HOURS : defaults.HOURS_QUOTA_TITLE.NORMAL_HOURS;

            if(!rentalLocation.unStaffedHours && isUnstaffedSchedule) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.LOCATION_IS_NOT_FOR_UNSTAFFED_HOURS);
            }

            if(rentalLocation.boardroomHours == defaults.FLAG.YES) {
                quotaKey = defaults.HOURS_QUOTA.BOARDROOM_HOURS
                quotaTitle = defaults.HOURS_QUOTA_TITLE.BOARDROOM_HOURS
            }

            /* req.body.peakHoursDeduction = 0;
            
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
            } */

            let userQuotaOptions = {
                where: {
                    userId: userInfo.id,
                    expiry: {[Op.gte]: moment.utc(parseInt(req.body.to)).format(defaults.dateTimeFormat)}
                },
                order: [['typeId', defaults.sortOrder.ASC]]
            };

            let userQuotaAgainstKeyPromise = UserHoursQuota.findAll(userQuotaOptions);

            let weeklyBookingPromise = RentalLocation.getBookings({quotaType: HoursQuotaType.CONSTANTS[quotaKey], from: startOfWeek, to: endOfWeek, userId: userInfo.id});

            let hoursQuotaTypePromise = HoursQuotaType.findOne({
                where: {
                    key: quotaKey
                }
            });

            let [userQuotaAgainstKey, hoursQuotaType, weeklyBooking] = await bbPromise.all([userQuotaAgainstKeyPromise, hoursQuotaTypePromise, weeklyBookingPromise]);
            
            if(_.isEmpty(userQuotaAgainstKey)) {
                errorMessages.push(req.app.locals.translation.CONSTRAINTS.QUOTA_NOT_VALID);
                return res.status(400).send({ error: errorMessages });
            }

            req.body.active       = defaults.FLAG.YES;
            req.body.bookedBy     = userInfo.id;
            req.body.quotaImpact  = rentalLocation.quotaImpact;
            req.body.duration     = bookingHours;
            req.body.quotaType    = hoursQuotaType.id;

            let formattedUserQuota = _.groupBy(userQuotaAgainstKey, "typeId");
            let defaultQuotaSet = _.first(formattedUserQuota[QuotaType.CONSTANTS.DEFAULT]);
            let extendedHours = _.first(formattedUserQuota[QuotaType.CONSTANTS.EXTENSION]);
            let defaultQuotaKeyHours = (!_.isEmpty(defaultQuotaSet)) ? defaultQuotaSet[quotaKey] : 0;
            let extendedQuotaKeyHours = (!_.isEmpty(extendedHours)) ? extendedHours[quotaKey] : 0;
            let weeklyHoursUsed   = _.sumBy(weeklyBooking, 'duration');
console.log("\n\n\n weeklyHoursUsed \n\n\n", JSON.stringify(weeklyHoursUsed));
            let weeklyQuotaOfDefaultHours = (weeklyLimitHoursQuota[quotaKey] - weeklyHoursUsed >= 0) ? weeklyLimitHoursQuota[quotaKey] - weeklyHoursUsed : 0
            weeklyQuotaOfDefaultHours = (weeklyQuotaOfDefaultHours < defaultQuotaKeyHours) ? weeklyQuotaOfDefaultHours : defaultQuotaKeyHours;

            if(rentalLocation.quotaImpact) {
                
                let quotaDeductionArr = [];

                if(weeklyQuotaOfDefaultHours >= bookingHours) {

                    let defaultQuotaChangeParams = {};
                    
                    defaultQuotaChangeParams[quotaKey] = defaultQuotaSet[quotaKey] - bookingHours;
                    defaultQuotaChangeParams.where = { id: defaultQuotaSet.id };
                    req.body.hourQuotaId = defaultQuotaSet.id;
                    quotaDeductionArr.push(defaultQuotaChangeParams);

                } else if((weeklyQuotaOfDefaultHours + extendedQuotaKeyHours) >= bookingHours) {

                    let defaultQuotaChangeParams = {};
                    let extendedQuotaChangeParams = {};
                    
                    bookingHours -= weeklyQuotaOfDefaultHours;
                    defaultQuotaChangeParams[quotaKey] = defaultQuotaSet[quotaKey] - weeklyQuotaOfDefaultHours;
                    defaultQuotaChangeParams.where = { id: defaultQuotaSet.id };
                    quotaDeductionArr.push(defaultQuotaChangeParams);

                    extendedQuotaChangeParams[quotaKey] = extendedHours[quotaKey] - bookingHours;
                    extendedQuotaChangeParams.where = {id: extendedHours.id};
                    req.body.hourQuotaId = extendedHours.id;
                    quotaDeductionArr.push(extendedQuotaChangeParams);

                } else {
                    errorMessages.push(`For this week you have only ${(weeklyQuotaOfDefaultHours + extendedQuotaKeyHours)} ${quotaTitle} Remaining.`);
                    return res.status(400).send({ error: errorMessages });
                }

                req.body.quotaDeductionArr = quotaDeductionArr;
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
