var createError               = require('http-errors');
var express                   = require('express');
var path                      = require('path');
var cookieParser              = require('cookie-parser');
// var logger                    = require('morgan');
let routes                    = require('./routes/appRouter');
let authenticationMiddleware  = require('./middlewares/Authentication');
var i18n                      = require("i18n-express");
let responseHandler           = require('./helpers/ResponseHandler');
let logger                    = require('./helpers/Logger');
const syncListingsJob   = require('./jobs/SyncListings');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(i18n({
  translationsPath: path.join(__dirname, 'languages'),
  siteLangs: ["en"],
  textsVarName: 'translation'
}));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authenticationMiddleware.isAuthenticUser.unless(
  { path: [
      { url: '/authentication/login', methods: ['POST'] },
      { url: '/comments', methods: ['GET'] },
      { url: '/users', methods: ['POST'] },
      { url: '/blogPosts', methods: ['GET'] },
      { url: '/blogPosts/categories/count', methods: ['GET'] },
      { url: '/blogPosts/recent', methods: ['GET'] },
      { url: '/rentalLocations', methods: ['GET'] },
      { url: '/tags', methods: ['GET'] },
      { url: '/rentalLocations/:id/availibility', methods: ['GET'] },
      { url: '/comments/visitor', methods: ['POST'] },
    ]
  }
));

var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.minute = 57;
schedule.scheduleJob(rule, () => {
  syncListingsJob.run();
});

routes(app);

// Catch error from all over the application here & pass to response middleware.
app.use(function (err, req, res, next) {
  req.error = err;
  logger.error(err, req.url, err.stack );
  if (err.code === 'permission_denied') {
    res.status(401).send('insufficient permissions');
  }else{
    responseHandler.sendError(err, res);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
