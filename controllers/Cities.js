'use strict';
const express = require('express');
const router = express.Router();
const defaults = require('../config/defaults');
const {
    City,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        res.status(200).send(await City.findAll({
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

module.exports = router;