'use strict';
const express        = require('express');
const router         = express.Router();
const _              = require('lodash');
const bbPromise      = require('bluebird');
const md5            = require('md5');
const userMiddleware = require('../middlewares/Users');
const helper         = require('../helpers/Helper');
const defaults       = require('../config/defaults');

const {
    User,
    UserHoursQuota,
    QuotaType,
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
        req.query.userId = req.params.userId;
        let userHoursQuotaRes = await UserHoursQuota.getQuota(req.query);
        userHoursQuotaRes.rows = await UserHoursQuota.formatWeeklyAndMonthlyQuota(userHoursQuotaRes.rows, req.params.userId);
        userHoursQuotaRes.rows = userHoursQuotaRes.rows[req.params.userId];
        res.send(200, JSON.stringify(userHoursQuotaRes));
    } catch (err) {
        next(err);
    }
});

router.post('/:userId/quotaExtension', async (req, res, next) => {
    try {
        req.body.userId = req.params.userId;
        req.body.updatedBy = req.user.id;
        let userHoursQuotaRes = await UserHoursQuota.setQuotaExtension(req.body);
        res.send(200, JSON.stringify(userHoursQuotaRes));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', userMiddleware.editUser, async (req, res, next) => {
    try {
        let usersEditPromise = User.update(User.getRawParams(req.body), {where: {id: req.params.id} });
        let usersQuotaEditPromise = UserHoursQuota.update(UserHoursQuota.getRawParams(req.body), {where: {userId: req.params.id, typeId: QuotaType.CONSTANTS.DEFAULT} });
        let [usersRes, userQuotaRes] = await bbPromise.all([usersEditPromise, usersQuotaEditPromise]);
        res.send(200, JSON.stringify(usersRes));
    } catch (err) {
        next(err);
    }
});

router.put('/:id/resetPassword', userMiddleware.resetPassword, async (req, res, next) => {
    try {
        let resetPasswordRes = User.update({ password: md5(req.body.password) }, {where: {id: req.params.id} });
        res.send(200, JSON.stringify(resetPasswordRes));
    } catch (err) {
        next(err);
    }
});

router.post('/', userMiddleware.addUser, async (req, res, next) => {
    try {
        let usersRes = await User.createNewUser(User.getRawParams(req.body));

        let emailParams = {
            subject: defaults.WELCOME_EMAIL.SUBJECT,
            emailContent: defaults.WELCOME_EMAIL.CONTENT,
            from: defaults.WELCOME_EMAIL.FROM,
            to: usersRes.email,
        }

        emailParams.valuesToReplaceArr = [
            {
                name: '{{name}}',
                value: `${usersRes.firstName} ${(usersRes.lastName) ? usersRes.lastName : ''}`
            }
        ];
        await helper.sendEmail(emailParams);
        res.send(200, JSON.stringify(usersRes));
    } catch (err) {
        next(err);
    }
});

module.exports = router;