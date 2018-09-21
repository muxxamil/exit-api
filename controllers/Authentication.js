'use strict';

const express               = require('express');
const router                = express.Router();
const authenticationHelper  = require('../helpers/Authentication');
const md5                   = require('md5');
const _                     = require('lodash');

const {
    User
}                           = require('../models');
router.post('/login', async (req, res, next) => {

    try {

        let errorMessage = 'Please provide the required attributes ';

        if (!req.body.email || !req.body.password) {
            errorMessage = !req.body.email     ? errorMessage +  " 'email' "   : errorMessage;
            errorMessage = !req.body.password     ? errorMessage +  " 'password' "   : errorMessage;
            return res.status(400).send({ message: errorMessage });
        }

        let params = { email: req.body.email, password: md5(req.body.password) };
        let userRes = await User.getUsers(params);

        if(userRes.count > 1) {
            return res.status(409).send({ message: req.app.locals.translation.AUTHENTICATION.MULTIPLE_ACCOUNTS });
        }

        userRes = _.first(userRes.rows); 

        if(_.isEmpty(userRes)) {
            return res.status(400).send({ message: req.app.locals.translation.AUTHENTICATION.CREDENTIALS_INVALID });
        }

        if(userRes.deleted == true) {
            return res.status(405).send({ message: req.app.locals.translation.AUTHENTICATION.CREDENTIALS_SUSPENDED });
        }

        res.status(200).send({
            token: authenticationHelper.generateToken(userRes),
            userInfo: userRes
        });

    } catch (error) {
        next(error);
    }

});

router.get('/refreshToken', (req, res, next) => {

    if (req.user) {
        return res.json({ token: jwt.generate(req.user) });
    } else {
        res.status(401).send({ message: req.app.locals.translation.AUTHENTICATION.TOKEN_EXPIRE });
    }

});


module.exports = router;
