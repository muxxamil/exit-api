'use strict';

const jwt                       = require('jsonwebtoken');
const defaults                  = require('../config/defaults');

const authenticUser = function (req, res, next) {

    if ('token' in req.headers) {

        jwt.verify(req.headers.token, defaults.jwtSecret, function(err, decoded) {

            if (err === null && decoded.data.id) {

                req.user          = decoded.data;
                req.privileges    = decoded.data.privileges;
                
                return next();

            } else {
                res.status(401).send({ message: req.app.locals.translation.AUTHENTICATION.TOKEN_EXPIRE });
            }
        });
        
    } else {
        res.status(401).send({ message: req.app.locals.translation.AUTHENTICATION.TOKEN_MISSING });            
    }
};

const authenticToken = function (req, res, next) {

    if ('token' in req.headers) {

        jwt.verify(req.headers.token, defaults.jwtSecret, function(err, decoded) {

            if (err === null) {
                return next();
            } else {
                res.status(401).send({ message: req.app.locals.translation.AUTHENTICATION.TOKEN_EXPIRE });
            }
        });
        
    } else {
        res.status(401).send({ message: req.app.locals.translation.AUTHENTICATION.TOKEN_MISSING });            
    }
};

authenticToken.unless = require('express-unless');

module.exports = { 
    'isAuthenticUser' : authenticUser,
    'isAuthenticToken' : authenticToken,
};
