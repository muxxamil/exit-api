module.exports = (app) => {

  /* GET home page. */
  app.use('/users', require('../controllers/Users'));
  app.use('/authentication', require('../controllers/Authentication'));
  app.use('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
  });

}
