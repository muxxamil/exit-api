require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host:     process.env.DB_HOST,
        dialect:  process.env.DB_DIALECT,
        port:     process.env.DB_PORT,
        timezone: process.env.DB_TIMEZONE,
        pool: {
            max: process.env.POOL_MAX_SIZE,
            min: process.env.POOL_MIN_SIZE,
            acquire: process.env.POOL_ACQUIRE,
            idle: process.env.POOL_IDLE,
            evict: process.env.POOL_EVICT,
            handleDisconnects: process.env.POOL_HANDLE_DISCONNECTS
        }
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host:     process.env.DB_HOST,
        dialect:  process.env.DB_DIALECT,
        port:     process.env.DB_PORT,
        timezone: process.env.DB_TIMEZONE
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host:     process.env.DB_HOST,
        dialect:  process.env.DB_DIALECT,
        port:     process.env.DB_PORT,
        timezone: process.env.DB_TIMEZONE,
        pool: {
            max: process.env.POOL_MAX_SIZE,
            min: process.env.POOL_MIN_SIZE,
            acquire: process.env.POOL_ACQUIRE,
            idle: process.env.POOL_IDLE,
            evict: process.env.POOL_EVICT,
            handleDisconnects: process.env.POOL_HANDLE_DISCONNECTS
        }
    }
};
