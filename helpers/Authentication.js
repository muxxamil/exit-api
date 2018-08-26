'use strict';

const jwt             = require('jsonwebtoken');
const defaults        = require('../config/defaults');

const authenticationHelper = {};

authenticationHelper.generateToken = (userData) => {
    return jwt.sign({ data: userData }, defaults.jwtSecret, { expiresIn: defaults.tokenDuration });
}

authenticationHelper.verifyToken = (token) => {
    return jwt.verify(token, defaults.jwtSecret);
}

module.exports = authenticationHelper;
