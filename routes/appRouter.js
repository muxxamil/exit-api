module.exports = (app) => {

  /* GET home page. */
  app.use('/users', require('../controllers/Users'));
  app.use('/tags', require('../controllers/Tags'));
  app.use('/authentication', require('../controllers/Authentication'));
  app.use('/blogPosts', require('../controllers/BlogPosts'));
  app.use('/comments', require('../controllers/Comments'));

}
