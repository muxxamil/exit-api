'use strict';
const express   = require('express');
const router    = express.Router();
const bbPromise = require('bluebird');
const _         = require('lodash');
const blogPostMiddleware = require('../middlewares/BlogPosts');

const {
    BlogPost,
    BlogCategory
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

router.get('/categories/count', async (req, res, next) => {
    try {
        res.status(200).send(await BlogPost.getBlogPostsCategoriesCounts());
    } catch (err) {
        next(err);
    }
});



router.get('/categories', async (req, res, next) => {
    try {
        res.status(200).send(await BlogCategory.findAll({
            attributes: ['id', 'title']
        }));
    } catch (err) {
        next(err);
    }
});

router.post('/', blogPostMiddleware.addPost, async (req, res, next) => {
    try {
        let createBlogPostResult = await BlogPost.createBlogPost(req.body);
        res.send(200, createBlogPostResult);
    } catch (err) {
        next(err);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        
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

router.get('/recent', async (req, res, next) => {
    try {
        const params = {pageLimit: 5};
        let blogDataAndCountPromises = BlogPost.getBlogPosts(params);
        let [data, count] = await bbPromise.all([blogDataAndCountPromises.dataPromise, blogDataAndCountPromises.countPromise]);
        res.send(200, data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;