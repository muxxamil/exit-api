'use strict';

const defaults  = require('../config/defaults');
const _         = require('lodash');
const md5       = require('md5');
const {
    User,
} = require('../models');

const UserMiddleware = {};

UserMiddleware.addUser = async (req, res, next) => {
    let errorMessages = [];

    if(_.isEmpty(req.body.name)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.NAME);
    }

    if(_.isEmpty(req.body.password)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.PASSWORD);
    } else {
        req.body.password = md5(req.body.password);
    }

    if(_.isEmpty(req.body.email)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.EMAIL);
    } else {
        let duplicateUser = await User.findOne(
            {
                where: { email: req.body.email }
            });
        if(!_.isEmpty(duplicateUser)) {
            return res.status(400).send({ error: [ req.app.locals.translation.CONSTRAINTS.EMAIL_ALREADY_EXIST ] });
        }
    }

    if(_.isEmpty(req.body.designationId )) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.DESIGNATION_ID);
    }

    if(!_.isNumber(parseFloat(req.body.normalHours)) || req.body.normalHours < 0) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.NORMAL_HOURS);
    }

    if(!_.isNumber(parseFloat(req.body.boardroomHours)) || req.body.boardroomHours < 0) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.BOARDROOM_HOURS);
    }

    if(!_.isNumber(parseFloat(req.body.unStaffedHours)) || req.body.unStaffedHours < 0) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.UNSTAFFED_HOURS);
    }

    if(_.isEmpty(req.body.active)) {
        req.body.active = false;
    }
    req.body.addedBy    = (req.user && req.user.id) ? req.user.id : null;
    req.body.updatedBy    = (req.user && req.user.id) ? req.user.id : null;

    if(!_.isEmpty(errorMessages)) {
        return res.status(400).send({ error: errorMessages });
    }

    next();
};



UserMiddleware.editUser = async (req, res, next) => {
    let errorMessages = [];

    if(_.isEmpty(req.body.name)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.NAME);
    }

    if(_.isEmpty(req.body.email)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.EMAIL);
    } else {
        let duplicateUser = await User.findOne(
            {
                where: { email: req.body.email }
            });
        if(!_.isEmpty(duplicateUser) && req.params.id != duplicateUser.id) {
            return res.status(400).send({ error: [ req.app.locals.translation.CONSTRAINTS.EMAIL_ALREADY_EXIST ] });
        }
    }

    if(_.isEmpty(req.body.designationId )) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.DESIGNATION_ID);
    }

    if(!_.isNumber(parseFloat(req.body.normalHours)) || req.body.normalHours < 0) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.NORMAL_HOURS);
    }

    if(!_.isNumber(parseFloat(req.body.boardroomHours)) || req.body.boardroomHours < 0) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.BOARDROOM_HOURS);
    }

    if(!_.isNumber(parseFloat(req.body.unStaffedHours)) || req.body.unStaffedHours < 0) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.UNSTAFFED_HOURS);
    }

    /* if(_.isEmpty(req.body.active)) {
        req.body.active = false;
    } */

    req.body.updatedBy = req.user.id;

    if(!_.isEmpty(errorMessages)) {
        return res.status(400).send({ error: errorMessages });
    }

    next();
};

module.exports = UserMiddleware;
