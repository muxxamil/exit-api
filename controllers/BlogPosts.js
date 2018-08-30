'use strict';
const express   = require('express');
const router    = express.Router();
const bbPromise = require('bluebird');
const _         = require('lodash');

const {
    BlogPost,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        let params = req.query ? req.query : {};
        let blogDataAndCountPromises = BlogPost.getBlogPosts(params);
        let [data, count] = await bbPromise.all([blogDataAndCountPromises.dataPromise, blogDataAndCountPromises.countPromise]);
        res.send(200, {count: _.isEmpty(count) ? 0 : count.count, rows: data});
    } catch (err) {
        next(err);
    }
});

module.exports = router;