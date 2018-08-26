'use strict';

var fs                = require('fs');
var path              = require('path');
var dotenv            = require('dotenv').config();
var Sequelize         = require('sequelize');
var extendedService   = require('./extend/extendedService.js');
var basename          = path.basename(module.filename);
var db                = {};

const config = {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: process.env.APP_TIMEZONE,
    pool: {
      max: process.env.POOL_MAX_SIZE,
      min: process.env.POOL_MIN_SIZE,
      acquire: process.env.POOL_ACQUIRE,
      idle: process.env.POOL_IDLE,
      evict: process.env.POOL_EVICT,
      handleDisconnects: process.env.POOL_HANDLE_DISCONNECTS
    }
  };
  console.log("AQW", JSON.stringify(config));
  var sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, config);

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    extendedService(model);
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
