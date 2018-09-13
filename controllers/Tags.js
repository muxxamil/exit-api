'use strict';
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const op = sequelize.Op;
const {
    Tag,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        let whereClause = Tag.getRawParams(req.query);
        whereClause.active = Tag.CONSTANTS.ACTIVE.YES;
        let tagRes = await Tag.findAndCountAll({
            attributes: ['id', 'key', 'title'],
            where: whereClause,
            order : [['id', 'ASC']]
        });
        res.send(200, JSON.stringify(tagRes));
    } catch (err) {
        next(err);
    }
});

module.exports = router;