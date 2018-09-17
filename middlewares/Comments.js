'use strict';

const defaults  = require('../config/defaults');
const _         = require('lodash');
const {
    Comment,
} = require('../models');
const CommentMiddleware = {};

CommentMiddleware.addComment = (req, res, next) => {
    let errorMessages = [];
    if(_.isEmpty(req.body.againstType)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.AGAINST_TYPE);
    }
    
    if(_.isEmpty(req.body.againstId)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.AGAINST_ID);
    }
    
    if(_.isEmpty(req.body.comment)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.COMMENT);
    }
    
    req.body.addedBy = req.user.id;
    req.body.updatedBy = req.user.id;
    req.body.status = Comment.CONSTANTS.STATUS.PENDING;
    req.body.active = Comment.CONSTANTS.ACTIVE.YES;
    
    if(!_.isEmpty(errorMessages)) {
        return res.status(400).send({ error: errorMessages });
    }

    next();
};

CommentMiddleware.addCommentByVisitor = (req, res, next) => {
    let errorMessages = [];

    if(_.isEmpty(req.body.againstType)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.AGAINST_TYPE);
    }

    if(_.isEmpty(req.body.againstId)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.AGAINST_ID);
    }

    if(_.isEmpty(req.body.comment)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.COMMENT);
    }

    if(_.isEmpty(req.body.addedByEmail)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.ADDED_BY_EMAIL);
    }

    if(_.isEmpty(req.body.addedByName)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.ADDED_BY_NAME);
    }

    if(!_.isEmpty(errorMessages)) {
        return res.status(400).send({ error: errorMessages });
    }

    next();
};

CommentMiddleware.addCommentByStaff = (req, res, next) => {
    let errorMessages = [];

    if(_.isEmpty(req.body.againstType)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.AGAINST_TYPE);
    }

    if(_.isEmpty(req.body.againstId)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.AGAINST_ID);
    }

    if(_.isEmpty(req.body.comment)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.COMMENT);
    }
    
    if(!_.isEmpty(errorMessages)) {
        return res.status(400).send({ error: errorMessages });
    }

    next();
};

module.exports = CommentMiddleware;
