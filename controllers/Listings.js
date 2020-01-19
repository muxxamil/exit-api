'use strict';
const express = require('express');
const router = express.Router();
const defaults = require('../config/defaults');
const {
    ListingPurpose,
    ListingType,
    Listing
} = require('../models');

router.get('/types', async (req, res, next) => {
    try {
        res.status(200).send(await ListingType.findAll({
            attributes: ['id', 'title'],
            where: {
                active: defaults.FLAG.YES
            },
            order : [['title', defaults.sortOrder.ASC]]
        }));
    } catch (err) {
        next(err);
    }
});

router.get('/purposes', async (req, res, next) => {
    try {
        res.status(200).send(await ListingPurpose.findAll({
            attributes: ['id', 'title'],
            where: {
                active: defaults.FLAG.YES
            },
            order : [['title', defaults.sortOrder.ASC]]
        }));
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const result = await Listing.getListings(req.query);
        console.log(result);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;