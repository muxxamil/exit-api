'use strict';

const defaults  = require('../config/defaults');
const _         = require('lodash');
const {
    Comment,
} = require('../models');
const RentalLocationMiddleware = {};

RentalLocationMiddleware.getFutureBookings = (req, res, next) => {
    let errorMessages = [];
    
    if(!_.isEmpty(errorMessages)) {
        return res.status(400).send({ error: errorMessages });
    }

    next();
};

module.exports = RentalLocationMiddleware;
