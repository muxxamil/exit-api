'use strict';

const http              = require('http');
const responseHandler   = {};
const _                 = require('lodash');
const defaults          = require('../config/defaults');
const {
    UserRelation,
}                           = require('../models');


responseHandler.getResponseStatusMsg = (statusCode) => {
    return { 'message' : http.STATUS_CODES[statusCode] }
};


responseHandler.setCustomError = (code, message) => {
    return {customStatus: code, customMessage: {message: message}};
};


responseHandler.getCustomErrorStatus = (error) => {
    return error.customStatus || 500;
};


responseHandler.getCustomErrorMsg = (error) => {
    return error.customMessage || responseHandler.getResponseStatusMsg(500);
};


responseHandler.sendError = (error, res) => {
    res.status(responseHandler.getCustomErrorStatus(error))
        .send(responseHandler.getCustomErrorMsg(error));

};

responseHandler.FillPrivilegesAgainstResponse = async (userId, agencyId, userPrivs, response, keyToCheckPriv = 'privilegedUserIds', specialPrivileges = {}, privCategoryWiseArr = []) => {
    let categoryWiseUserIds = [];
    if(!_.isEmpty(privCategoryWiseArr)) {
        categoryWiseUserIds = privCategoryWiseArr;
    } else {
        categoryWiseUserIds = await UserRelation.getTeamSelfAndAllUserIds(userId, agencyId);
    }
    
    let responseArr = response;
    let defaultKeyToCheckPrivOn = keyToCheckPriv;
    if(!_.isArray(response)) {
        responseArr = [];
        responseArr.push(response);
    }
    _.forEach(responseArr, function(responseObj, index) {
        responseObj.privileges = [];
        _.forEach(userPrivs, function(value, key) {
            defaultKeyToCheckPrivOn = keyToCheckPriv;
            if(!_.isEmpty(specialPrivileges) && !_.isEmpty(specialPrivileges[key])) {
                defaultKeyToCheckPrivOn = specialPrivileges[key];
            }
            let checkPrivCheckOnUser = _.isArray(responseObj[defaultKeyToCheckPrivOn]) ? responseObj[defaultKeyToCheckPrivOn] : [responseObj[defaultKeyToCheckPrivOn]];
            if(_.first(value) == defaults.PRIVILEGE_TYPES.ALL || _.intersection(checkPrivCheckOnUser, categoryWiseUserIds[_.first(value)]).length) {
                responseObj.privileges.push(key);
            }
        });
    });

    if(!_.isArray(response)) {
        return _.first(responseArr);
    }

    return responseArr;
};

module.exports = responseHandler;
