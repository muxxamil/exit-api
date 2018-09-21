'use strict';
const express                   = require('express');
const router                    = express.Router();
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
        let rentalLocationsResult = await RentalLocation.getBookings({date: req.query.date, rentalLocationId: req.params.id});
        res.status(200).send(rentalLocationsResult);
    } catch (err) {
        next(err);
    }
});

router.get('/:id/futureBookings', async (req, res, next) => {
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
});

module.exports = router;