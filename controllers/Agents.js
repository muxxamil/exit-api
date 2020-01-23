'use strict';
const express = require('express');
const router = express.Router();
const defaults = require('../config/defaults');
const {
    Agent,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        const whereClause = {};
        if(req.query.id) {
            whereClause.id = req.query.id;
        }
        res.status(200).send(await Agent.findAll({
            where: whereClause,
            order : [['name', defaults.sortOrder.ASC]]
        }));
    } catch (err) {
        next(err);
    }
});

module.exports = router;