'use strict';
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const _         = require('lodash');
const op = sequelize.Op;
const userMiddleware = require('../middlewares/Users');

const {
    User,
    UserHoursQuota,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        let params = req.query ? req.query : {};
        let usersRes = await User.getUsers(params);
        _.forEach(usersRes.rows, (singleObj) => {
            if(singleObj.id != req.user.id) {
                delete singleObj.password;
            }
        });
        res.send(200, JSON.stringify(usersRes));
    } catch (err) {
        next(err);
    }
});

router.get('/:id/quota', async (req, res, next) => {
    try {
        let userHoursQuotaRes = await UserHoursQuota.getQuota(req.query);
        res.send(200, JSON.stringify(userHoursQuotaRes));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', userMiddleware.editUser, async (req, res, next) => {
    try {
        let usersRes = await User.update(User.getRawParams(req.body), {where: {id: req.params.id} });
        res.send(200, JSON.stringify(usersRes));
    } catch (err) {
        next(err);
    }
});

router.post('/', userMiddleware.addUser, async (req, res, next) => {
    try {
        let usersRes = await User.create(User.getRawParams(req.body));
        res.send(200, JSON.stringify(usersRes));
    } catch (err) {
        next(err);
    }
});

module.exports = router;