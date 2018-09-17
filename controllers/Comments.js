'use strict';
const express   = require('express');
const router    = express.Router();

const commentMiddleware = require('../middlewares/Comments');
const {
    Comment,
    User,
    UserDesignation
} = require('../models');

router.post('/', commentMiddleware.addComment, async (req, res, next) => {
    try {
        console.log("req", req);
        let commentResult = await Comment.addComment(req.body);
        res.status(200).send(commentResult);
    } catch (err) {
        next(err);
    }
});

router.post('/visitor', commentMiddleware.addCommentByVisitor, async (req, res, next) => {
    try {
        let userDetail = await User.insertIgnoreUser({email: req.body.addedByEmail, name: req.body.addedByName, designationId: UserDesignation.CONSTANTS.VISITOR});
        let commentResult = await Comment.addComment({againstType: req.body.againstType, againstId: req.body.againstId, comment: req.body.comment, addedBy: userDetail.id});
        res.status(200).send(commentResult);
    } catch (err) {
        next(err);
    }
});

router.post('/staff', commentMiddleware.addCommentByStaff, async (req, res, next) => {
    try {
        let commentResult = await Comment.addComment({againstType: req.body.againstType, againstId: req.body.againstId, comment: req.body.comment, addedBy: req.id});
        res.status(200).send(commentResult);
    } catch (err) {
        next(err);
    }
});

module.exports = router;