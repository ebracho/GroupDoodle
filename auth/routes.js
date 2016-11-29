var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var User = mongoose.model('User');
var SessionToken = mongoose.model('SessionToken');
var router = express.Router();

// Load middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride());
router.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

// Middleware route handler that loads user from database
var getUser = function(req, res, next) {
  User.findOne({ userId: req.body.userId }, function(err, user) {
    req.user = user;
    next();
  });
};

router.route('/register')
  .post([getUser], function(req, res) {
    if(req.user) {
      res.status(400).send('User already exists');
    }
    else {
      User.create({ userId: req.body.userId }, function(err, user) {
        user.setPassword(req.body.password);
        req.session.userId = user.userId;
        SessionToken.create({ userId: req.body.userId }, function(err, sessionToken) {
          res.status(201).json(sessionToken);
        })
        console.log('it returned');
      });
    }
  });

router.route('/login')
  .post([getUser], function(req, res) {
    if(!req.user || !req.user.validatePassword(req.body.password)) {
      res.status(401).send('Incorrect userId or password');
    }
    else {
      req.session.userId = req.user.userId;
      SessionToken.create(req.user, function(err, sessionToken) {
        res.status(200).json(sessionToken);
      });
    }
  });

router.route('/logout')
  .post(function(req, res) {
    delete req.session.userId;
    res.sendStatus(200);
  });

router.route('/getLoggedInUser')
  .get(function(req, res) {
    if (req.session.userId) res.send(req.session.userId);
    else res.sendStatus(404);
  });

module.exports = router;
