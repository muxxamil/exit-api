'use strict';
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const _         = require('lodash');
const bbPromise = require('bluebird');
const op = sequelize.Op;
const userMiddleware = require('../middlewares/Users');

const {
    User,
    UserHoursQuota,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        let params = req.query ? req.query : {};
        let userDataAndCountPromises = User.getUsers(params);
        let [data, count] = await bbPromise.all([userDataAndCountPromises.dataPromise, userDataAndCountPromises.countPromise]);
        _.forEach(data, (singleObj) => {
            if(singleObj.id != req.user.id) {
                delete singleObj.password;
            }
        });
        res.send(200, {count: _.isEmpty(count) ? 0 : count.count, rows: data});
    } catch (err) {
        next(err);
    }
});

router.get('/:userId/quota', async (req, res, next) => {
    try {
        let userHoursQuotaRes = await UserHoursQuota.getQuota(req.params);
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
        let usersRes = await User.createNewUser(User.getRawParams(req.body));
        console.log("usersRes", JSON.stringify(usersRes));
        res.send(200, JSON.stringify(usersRes));
    } catch (err) {
        next(err);
    }
});

module.exports = router;