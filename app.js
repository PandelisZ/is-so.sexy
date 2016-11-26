/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');
const subdomain = require('express-subdomain');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const generatorController = require('./controllers/generator');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Define some routers
 */
const rooter = express.Router();
const subrouter = express.Router();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { /*maxAge: 31557600000*/ }));

/**
 * Primary app routes.
 */
rooter.get('/', homeController.index);
rooter.get('/login', userController.getLogin);
rooter.post('/login', userController.postLogin);
rooter.get('/logout', userController.logout);
rooter.get('/forgot', userController.getForgot);
rooter.post('/forgot', userController.postForgot);
rooter.get('/reset/:token', userController.getReset);
rooter.post('/reset/:token', userController.postReset);
rooter.get('/signup', userController.getSignup);
rooter.post('/signup', userController.postSignup);
rooter.get('/contact', contactController.getContact);
rooter.post('/contact', contactController.postContact);
rooter.get('/account', passportConfig.isAuthenticated, userController.getAccount);
rooter.get('/generator', generatorController.newShrine);
rooter.post('/generator/create', generatorController.createShrine)
//rooter.post('/generator/create', generatorController.createShrine);
rooter.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
rooter.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
rooter.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
rooter.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
rooter.get('/api', apiController.getApi);
rooter.get('/api/lastfm', apiController.getLastfm);
rooter.get('/api/nyt', apiController.getNewYorkTimes);
rooter.get('/api/aviary', apiController.getAviary);
rooter.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
rooter.get('/api/stripe', apiController.getStripe);
rooter.post('/api/stripe', apiController.postStripe);
rooter.get('/api/scraping', apiController.getScraping);
rooter.get('/api/twilio', apiController.getTwilio);
rooter.post('/api/twilio', apiController.postTwilio);
rooter.get('/api/clockwork', apiController.getClockwork);
rooter.post('/api/clockwork', apiController.postClockwork);
rooter.get('/api/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
rooter.get('/api/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
rooter.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
rooter.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
rooter.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
rooter.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
rooter.get('/api/linkedin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin);
rooter.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
rooter.get('/api/paypal', apiController.getPayPal);
rooter.get('/api/paypal/success', apiController.getPayPalSuccess);
rooter.get('/api/paypal/cancel', apiController.getPayPalCancel);
rooter.get('/api/lob', apiController.getLob);
rooter.get('/api/upload', apiController.getFileUpload);
rooter.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
rooter.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
rooter.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
rooter.get('/api/google-maps', apiController.getGoogleMaps);

/**
 * OAuth authentication routes. (Sign in)
 */
rooter.get('/auth/instagram', passport.authenticate('instagram'));
rooter.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
rooter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
rooter.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
rooter.get('/auth/github', passport.authenticate('github'));
rooter.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
rooter.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
rooter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
rooter.get('/auth/twitter', passport.authenticate('twitter'));
rooter.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
rooter.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
rooter.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
rooter.get('/auth/foursquare', passport.authorize('foursquare'));
rooter.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/foursquare');
});
rooter.get('/auth/tumblr', passport.authorize('tumblr'));
rooter.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/tumblr');
});
rooter.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
rooter.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
rooter.get('/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
rooter.get('/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/api/pinterest');
});

app.use(rooter);

/**
 * subrouter routes
 */
subrouter.get('/lol', (req, res) => res.send('should not work on root lol'));
app.use(subdomain("", subrouter));

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
