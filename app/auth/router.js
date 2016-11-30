var express = require('express');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var SessionToken = mongoose.model('SessionToken');
var router = express.Router();

// Middleware function that retrieves user based on form data
function loadUser(req, res, next) {
  User.findOne({ userId: req.body.userId }, function(err, user) {
    req.user = user;
    next();
  });
};

function register(req, res) {
  if(req.user) {
    res.status(400).send('User already exists');
  }
  else {
    User.create({ userId: req.body.userId }, function(err, user) {
      user.setPassword(req.body.password);
      req.session.userId = user.userId;
      SessionToken.create(user, function(err, sessionToken) {
        res.status(201).json(sessionToken);
      })
    });
  }
}

function login(req, res) {
  if(!req.user || !req.user.validatePassword(req.body.password)) {
    res.status(401).send('Incorrect userId or password');
  }
  else {
    req.session.userId = req.user.userId;
    SessionToken.create(req.user, function(err, sessionToken) {
      res.status(200).json(sessionToken);
    });
  }
}

function logout(req, res) {
  delete req.session.userId;
  res.sendStatus(200);
}

function getLoggedInUser(req, res) {
  if (req.session.userId) res.send(req.session.userId);
  else res.sendStatus(404);
}

router.post('/register', [loadUser], register);
router.post('/login', [loadUser], login);
router.post('/logout', logout);
router.get('/getLoggedInUser', getLoggedInUser);

module.exports = router;
