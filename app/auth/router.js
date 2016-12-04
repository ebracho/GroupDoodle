'use strict';

let express = require('express');
let User = require('../auth/models').User;
let SessionToken = require('../auth/models').SessionToken;
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
        req.session.user = user;
        SessionToken.create(user, function(err, sessionToken) {
          console.log(sessionToken);
          sessionToken.save();
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
    req.session.user = req.user;
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
  delete req.session.user;
  res.sendStatus(200);
}

/**
 * Responds with the current session's user or 404
 *
 * @param {Request} req
 * @param {Response} res
 */
function getLoggedInUser(req, res) {
  if (req.session.user) res.send(req.session.user.userId);
  else res.sendStatus(404);
}

router.post('/register', [loadUser], register);
router.post('/login', [loadUser], login);
router.post('/logout', logout);
router.get('/getLoggedInUser', getLoggedInUser);

module.exports = router;
