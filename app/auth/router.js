'use strict';

let express = require('express');
let mongoose = require('mongoose');

let User = mongoose.model('User');
let SessionToken = mongoose.model('SessionToken');
let router = new express.Router();

/**
 * Middleware function that retrieves user based on form data.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
function loadUser(req, res, next) {
  User.findOne({userId: req.body.userId}, function(err, user) {
    req.user = user;
    next();
  });
};

/**
 * Creates a new User, begins a session, and responds with a SessionToken.
 *
 * @param {Request} req
 * @param {Response} res
 */
function register(req, res) {
  if(req.user) {
    res.status(400).send('User already exists');
  } else {
    User.create({userId: req.body.userId}, function(err, user) {
      if (err) {
        res.sendStatus(400);
      } else {
        user.setPassword(req.body.password);
        req.session.userId = user.userId;
        SessionToken.create(user, function(err, sessionToken) {
          res.status(201).json(sessionToken);
        });
      }
    });
  }
}

/**
 * Begins a user session and responds with a SessionToken.
 *
 * @param {Request} req
 * @param {Response} res
 */
function login(req, res) {
  if(!req.user || !req.user.validatePassword(req.body.password)) {
    res.status(401).send('Incorrect userId or password');
  } else {
    req.session.userId = req.user.userId;
    SessionToken.create(req.user, function(err, sessionToken) {
      res.status(200).json(sessionToken);
    });
  }
}


/**
 * Ends the user's http session if it exists.
 *
 * @param {Request} req
 * @param {Response} res
 */
function logout(req, res) {
  delete req.session.userId;
  res.sendStatus(200);
}

/**
 * Responds with the current session's user or 404
 *
 * @param {Request} req
 * @param {Response} res
 */
function getLoggedInUser(req, res) {
  if (req.session.userId) res.send(req.session.userId);
  else res.sendStatus(404);
}

router.post('/register', [loadUser], register);
router.post('/login', [loadUser], login);
router.post('/logout', logout);
router.get('/getLoggedInUser', getLoggedInUser);

module.exports = router;
