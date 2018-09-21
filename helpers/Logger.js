'use strict';

require('dotenv').config();
const bunyan = require('bunyan');

const loggerStreams =  [{
    level: process.env.BUNYAN_STDOUT_LEVEL || 'info',
    stream: process.stdout
},
{
    type: 'rotating-file',
    period: '1m',
    level: 'info',
    path: '/var/tmp/propforce-node-error.log'  // log ERROR and above to a file
}];

const logger = bunyan.createLogger({
    name: 'curwinAdminApp',
    streams: loggerStreams
});

module.exports = logger;
