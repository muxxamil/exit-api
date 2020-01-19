'use strict';
const express = require('express');
const router = express.Router();
const defaults = require('../config/defaults');
const {
    ListingPurpose,
    ListingType,
    Listing,
    Company
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
        req.query.loadImages = true;
        const result = await Listing.getListings(req.query);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/own', async (req, res, next) => {
    try {
        const params = {
            companyId: [Company.CONSTANTS.COMPANIES.EXIT_REALTY_SPECIALISTS, Company.CONSTANTS.COMPANIES.EXIT_REALTY_SPECIALISTS_ROTHESAY],
            boardId: Company.CONSTANTS.BOARD.SAINT_JOHN,
            pageLimit: 9999
        };
        const result = await Listing.getListings(params);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

router.put('/toggleFeaturedProperty', async (req, res, next) => {
    try {
        const listingObj = await Listing.findOne({
            attributes: ['id', 'featured'],
            where: {
                id: req.body.id
            }
        });

        const result = await Listing.update({
            featured: !listingObj.featured
        }, {
            where: {
                id: listingObj.id
            }
        });
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/featured/count', async (req, res, next) => {
    try {
        const countOfFeatured = await Listing.find({
            attributes: [ [ sequelize.literal('count(*)'), 'count' ] ],
            subQuery: false,
            raw: true,
            where: {
                active: defaults.FLAG.YES,
                featured: defaults.FLAG.YES,
            }
        });

        res.status(200).send(countOfFeatured);
    } catch (err) {
        next(err);
    }
});

module.exports = router;