'use strict';

const defaults  = require('../config/defaults');
const moment         = require('moment');
const _         = require('lodash');
const md5       = require('md5');
const {
    User,
    Privilege
} = require('../models');

const UserMiddleware = {};

// UserMiddleware.addUser = async (req, res, next) => {
//     let errorMessages = [];

//     if(_.isEmpty(req.body.firstName)) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.FIRST_NAME);
//     }

//     if(_.isEmpty(req.body.lastName)) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.LAST_NAME);
//     }

//     if(_.isEmpty(req.body.password)) {
//         req.body.password = md5(moment.utc().valueOf());
//     } else {
//         req.body.password = md5(req.body.password);
//     }

//     if(_.isEmpty(req.body.email)) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.EMAIL);
//     } else {
//         let duplicateUser = await User.findOne(
//             {
//                 where: { email: req.body.email }
//             });
//         if(!_.isEmpty(duplicateUser)) {
//             return res.status(400).send({ error: [ req.app.locals.translation.CONSTRAINTS.EMAIL_ALREADY_EXIST ] });
//         }
//     }

//     if(_.isEmpty(req.body.designationId )) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.DESIGNATION_ID);
//     }

//     if(!_.isNumber(parseFloat(req.body.normalHours)) || req.body.normalHours < 0) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.NORMAL_HOURS);
//     }

//     if(!_.isNumber(parseFloat(req.body.boardroomHours)) || req.body.boardroomHours < 0) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.BOARDROOM_HOURS);
//     }

//     if(!_.isNumber(parseFloat(req.body.unStaffedHours)) || req.body.unStaffedHours < 0) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.UNSTAFFED_HOURS);
//     }

//     if(_.isEmpty(req.body.active)) {
//         req.body.active = false;
//     }
//     req.body.addedBy    = (req.user && req.user.id) ? req.user.id : null;
//     req.body.updatedBy    = (req.user && req.user.id) ? req.user.id : null;

//     if(!_.isEmpty(errorMessages)) {
//         return res.status(400).send({ error: errorMessages });
//     }

//     next();
// };



// UserMiddleware.editUser = async (req, res, next) => {
//     let errorMessages = [];

//     if(_.isEmpty(req.body.firstName)) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.FIRST_NAME);
//     }

//     if(_.isEmpty(req.body.lastName)) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.LAST_NAME);
//     }

//     if(_.isEmpty(req.body.email)) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.EMAIL);
//     } else {
//         let duplicateUser = await User.findOne(
//             {
//                 where: { email: req.body.email }
//             });
//         if(!_.isEmpty(duplicateUser) && req.params.id != duplicateUser.id) {
//             return res.status(400).send({ error: [ req.app.locals.translation.CONSTRAINTS.EMAIL_ALREADY_EXIST ] });
//         }
//     }

//     if(_.isEmpty(req.body.designationId )) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.DESIGNATION_ID);
//     }

//     if(!_.isNumber(parseFloat(req.body.normalHours)) || req.body.normalHours < 0) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.NORMAL_HOURS);
//     }

//     if(!_.isNumber(parseFloat(req.body.boardroomHours)) || req.body.boardroomHours < 0) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.BOARDROOM_HOURS);
//     }

//     if(!_.isNumber(parseFloat(req.body.unStaffedHours)) || req.body.unStaffedHours < 0) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.UNSTAFFED_HOURS);
//     }

//     /* if(_.isEmpty(req.body.active)) {
//         req.body.active = false;
//     } */

//     req.body.updatedBy = req.user.id;

//     if(!_.isEmpty(errorMessages)) {
//         return res.status(400).send({ error: errorMessages });
//     }

//     next();
// };

// UserMiddleware.resetPassword = (req, res, next) => {
//     let errorMessages = [];

//     if(req.params.id != req.user.id && _.indexOf(req.user.privileges, Privilege.CONSTANTS.CAN_RESET_ALL_PASSWORD) == -1) {
//         errorMessages.push(req.app.locals.translation.PRIVILEGES.CANNOT_CHANGE_THIS_PASSWORD);
//         return res.status(400).send({ error: errorMessages });
//     }

//     if(req.params.id == req.user.id && _.indexOf(req.user.privileges, Privilege.CONSTANTS.CAN_RESET_MY_PASSWORD) == -1) {
//         errorMessages.push(req.app.locals.translation.PRIVILEGES.CANNOT_CHANGE_OWN_PASSWORD);
//         return res.status(400).send({ error: errorMessages });
//     }

//     if(_.isEmpty(req.body.password )) {
//         errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.PASSWORD);
//     }

//     if(!_.isEmpty(errorMessages)) {
//         return res.status(400).send({ error: errorMessages });
//     }

//     req.body.updatedBy = req.user.id;

//     next();
// }

module.exports = UserMiddleware;
