module.exports = (app) => {

  /* GET home page. */
  app.use('/users', require('../controllers/Users'));
  app.use('/authentication', require('../controllers/Authentication'));
  app.use('/blogPosts', require('../controllers/BlogPosts'));
  app.use('/cities', require('../controllers/Cities'));
  app.use('/listings', require('../controllers/Listings'));
  app.use('/agents', require('../controllers/Agents'));

}
