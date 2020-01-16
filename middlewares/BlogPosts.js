'use strict';

const defaults  = require('../config/defaults');
const _         = require('lodash');
const {
    BlogPost,
} = require('../models');

const BlogPostsMiddleware = {};

BlogPostsMiddleware.addPost = async (req, res, next) => {
    let errorMessages = [];

    if(_.isEmpty(req.body.title)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.TITLE);
    } else {
        req.body.key = req.body.title.split(' ').join('_');
    }

    if(_.isEmpty(req.body.postDetail)) {
        errorMessages.push(req.app.locals.translation.MISSING_ATTRIBUTES.PRE_POST_DETAIL);
    }

    if(_.isEmpty(req.body.active)) {
        req.body.active = true;
    }

    req.body.addedBy    = req.user.id;
    req.body.updatedBy  = req.user.id;

    if(!_.isEmpty(errorMessages)) {
        return res.status(400).send({ error: errorMessages });
    }

    next();
};

module.exports = BlogPostsMiddleware;
