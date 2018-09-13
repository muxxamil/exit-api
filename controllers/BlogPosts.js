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
        console.log("blogDataAndCountPromises", blogDataAndCountPromises);
        let [data, count] = await bbPromise.all([blogDataAndCountPromises.dataPromise, blogDataAndCountPromises.countPromise]);
        console.log("data", data);
        console.log("count", count);
        console.log("{count: _.isEmpty(count) ? 0 : count.count, rows: data}", {count: _.isEmpty(count) ? 0 : count.count, rows: data});
        res.send(200, {count: _.isEmpty(count) ? 0 : count.count, rows: data});
    } catch (err) {
        next(err);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        console.log(req.query.ids);
        
        if(_.isEmpty(req.query.ids)) {
            return res.send(400, {});
        }

        let deleteBlogPosts = await BlogPost.update({
            active: BlogPost.CONSTANTS.ACTIVE.NO
        }, {
            where: { id: req.query.ids }
        });

        res.send(200, deleteBlogPosts);
    } catch (err) {
        next(err);
    }
});

module.exports = router;