'use strict';
const express                   = require('express');
const router                    = express.Router();
const _                         = require('lodash');
const moment                    = require('moment-timezone');
const defaults                  = require('../config/defaults');
const RentalLocationMiddleware  = require('../middlewares/RentalLocations');
const LocationBookingsMiddleware= require('../middlewares/LocationBookings');

const {
    RentalLocation,
    LocationBooking,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        let rentalLocationsResult = await RentalLocation.getRentalLocations({active: defaults.FLAG.YES});
        res.status(200).send(rentalLocationsResult);
    } catch (err) {
        next(err);
    }
});

router.post('/:id/book', LocationBookingsMiddleware.add, async (req, res, next) => {
    try {
        let rentalLocationsResult = await LocationBooking.bookRentalLocation(req.body);
        res.status(200).send(rentalLocationsResult);
    } catch (err) {
        next(err);
    }
});

router.get('/:id/bookings', async (req, res, next) => {
    try {
        let rentalLocationsResult = await RentalLocation.getBookings({from: req.query.from, to: req.query.to, rentalLocationId: req.params.id});
        res.status(200).send(rentalLocationsResult);
    } catch (err) {
        next(err);
    }
});

router.get('/:id/staffedHours', async (req, res, next) => {
    try {
        
        if(_.isEmpty(req.query.dayNumber)) {
            return res.status(400).send({ error: [req.app.locals.translation.MISSING_ATTRIBUTES.DAY_NUMBER] });
        }

        let rentalLocationsResult = await RentalLocation.getDetailedRentalLocation(req.params.id);
        let staffedHoursArr = (!_.isEmpty(rentalLocationsResult.StaffedHours)) ? _.keyBy(rentalLocationsResult.StaffedHours, 'dayNumber') : _.keyBy(rentalLocationsResult.OfficeLocation.StaffedHours, 'dayNumber');
        
        let staffedHourStart = moment.tz(req.query.date + " " + staffedHoursArr[req.query.dayNumber]['from'], defaults.dateTimeFormat);
        let staffedHourEnd   = moment.tz(req.query.date + " " + staffedHoursArr[req.query.dayNumber]['to'], defaults.dateTimeFormat);
        
        res.status(200).send({from: staffedHourStart, to: staffedHourEnd});
    } catch (err) {
        next(err);
    }
});

/* router.get('/:id/futureBookings', async (req, res, next) => {
    try {
        let rentalLocationsResult = await RentalLocation.getBookings({date: req.query.date, id: req.params.id, futureBookings: defaults.FLAG.YES});
        res.status(200).send(rentalLocationsResult);
    } catch (err) {
        next(err);
    }
});

router.get('/:id/pastBookings', async (req, res, next) => {
    try {
        let rentalLocationsResult = await RentalLocation.getBookings({date: req.query.date, id: req.params.id, futureBookings: defaults.FLAG.NO});
        res.status(200).send(rentalLocationsResult);
    } catch (err) {
        next(err);
    }
}); */

module.exports = router;