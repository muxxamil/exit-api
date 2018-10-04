'use strict';
const express            = require('express');
const router             = express.Router();
const defaults           = require('../config/defaults');
const LocationBookingsMiddleware = require('../middlewares/LocationBookings');

const {
    LocationBooking,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        let locationBookingResult = await LocationBooking.getLocationBookings(req.query);

        if(req.query.eventFormattedResult) {
            locationBookingResult.rows = LocationBooking.formatAccordingToEvents(locationBookingResult.rows);
        }

        res.status(200).send(locationBookingResult);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', LocationBookingsMiddleware.delete, async (req, res, next) => {
    try {
        req.body.id = req.params.id;
        let deleteLocationBookingRes = await LocationBooking.deleteBooking(req.body);

        res.status(200).send(deleteLocationBookingRes);
    } catch (err) {
        next(err);
    }
});

module.exports = router;