'use strict';
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const op = sequelize.Op;
const {
    UserDesignation,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        let usersDesignationRes = await UserDesignation.findAndCountAll({
            attributes: ['id', 'key', 'title'],
            where: UserDesignation.getRawParams(req.query),
            order : [['displayOrder', 'ASC']]
        });
        res.send(200, JSON.stringify(usersDesignationRes));
    } catch (err) {
        next(err);
    }
});

module.exports = router;