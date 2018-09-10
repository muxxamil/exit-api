'use strict';
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const op = sequelize.Op;
const {
    User,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        console.log("req.body", req.body);
        let params = req.query ? req.query : {};
        let usersRes = await User.getUsers(params);
        res.send(200, JSON.stringify(usersRes));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        let usersRes = await User.update(User.getRawParams(req.body), {where: {id: req.params.id} });
        res.send(200, JSON.stringify(usersRes));
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let usersRes = await User.create(User.getRawParams(req.body));
        res.send(200, JSON.stringify(usersRes));
    } catch (err) {
        next(err);
    }
});

module.exports = router;