'use strict';
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const op = sequelize.Op;
const {
    User,
} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        console.log("REQ", JSON.stringify(req.user));
        
        let params = req.query ? req.query : {};
        let usersRes = await User.getUsers(params);
        res.send(200, JSON.stringify(usersRes));
    } catch (err) {
        next(err);
    }
});

module.exports = router;