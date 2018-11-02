'use strict';
const defaults   = require('../config/defaults');
const nodemailer = require('nodemailer');


let helperService = {};

helperService.replaceStringValues = (content, values) => {

    values.forEach(function (value) {

        let regex = /(,)(?=[^]*[^\s])/g;
        regex = regex.source;
        regex = regex.replace(',', value.name);
        regex = new RegExp(regex, "g");

        content = content.replace(regex, value.value);
    });
    return content;
};

helperService.sendEmail = (configuration) => {
    let transporter = nodemailer.createTransport(defaults.SMTP_CONFIG, {from: configuration.from});
    let mailOptions = {
        from: configuration.from,
        to: configuration.to,
        subject: configuration.subject,
        html: helperService.replaceStringValues(configuration.emailContent, configuration.valuesToReplaceArr)
    };

    return transporter.sendMail(mailOptions);
};

module.exports = helperService;