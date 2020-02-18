const authenticationMiddleware  = require('../middlewares/Authentication');

module.exports = (app) => {

  /* GET home page. */
  app.use('/users', require('../controllers/Users'));
  app.use('/authentication', require('../controllers/Authentication'));
  app.use('/blogPosts', require('../controllers/BlogPosts'));
  app.use('/cities', authenticationMiddleware.isAuthenticToken, require('../controllers/Cities'));
  app.use('/listings', authenticationMiddleware.isAuthenticToken, require('../controllers/Listings'));
  app.use('/agents', authenticationMiddleware.isAuthenticToken, require('../controllers/Agents'));

}
