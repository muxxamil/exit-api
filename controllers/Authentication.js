'use strict';

const express               = require('express');
const router                = express.Router();
const md5                   = require('md5');
const _                     = require('lodash');
const authenticationHelper  = require('../helpers/Authentication');
const defaults              = require('../config/defaults');

const {
    User,
    // UserDesignation
}                           = require('../models');
// router.post('/login', async (req, res, next) => {

//     try {

//         let errorMessage = 'Please provide the required attributes ';

//         if (!req.body.email || !req.body.password) {
//             errorMessage = !req.body.email     ? errorMessage +  " 'email' "   : errorMessage;
//             errorMessage = !req.body.password     ? errorMessage +  " 'password' "   : errorMessage;
//             return res.status(400).send({ message: errorMessage });
//         }

//         let params = { email: req.body.email, password: md5(req.body.password), active: defaults.FLAG.YES };
//         let userDataAndCountPromises = User.getUsers(params);
//         let userRes = await userDataAndCountPromises.dataPromise;
//         let userCount = await userDataAndCountPromises.countPromise;

//         if(!_.isEmpty(userCount) && userCount > 1) {
//             return res.status(409).send({ message: req.app.locals.translation.AUTHENTICATION.MULTIPLE_ACCOUNTS });
//         }

//         userRes = _.first(userRes);

//         if(_.isEmpty(userRes)) {
//             return res.status(400).send({ message: req.app.locals.translation.AUTHENTICATION.CREDENTIALS_INVALID });
//         }

//         userRes = userRes.get({ plain: true });

//         if(!_.isEmpty(userRes) && !_.isEmpty(userRes.UserDesignation) && !_.isEmpty(userRes.UserDesignation.UserPrivileges)) {
//             userRes.privileges = UserDesignation.getOnlyPrivKeys(userRes.UserDesignation.UserPrivileges);
//             delete userRes.UserDesignation.UserPrivileges;
//         }
        
//         if(userRes.deleted == true) {
//             return res.status(405).send({ message: req.app.locals.translation.AUTHENTICATION.CREDENTIALS_SUSPENDED });
//         }
        
//         res.status(200).send({
//             token: authenticationHelper.generateToken(userRes),
//             userInfo: userRes
//         });

//     } catch (error) {
//         next(error);
//     }

// });

// router.get('/refreshToken', (req, res, next) => {

//     if (req.user) {
//         return res.json({ token: jwt.generate(req.user) });
//     } else {
//         res.status(401).send({ message: req.app.locals.translation.AUTHENTICATION.TOKEN_EXPIRE });
//     }

// });


module.exports = router;
