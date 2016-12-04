'use strict';

let express = require('express');
let DoodleRoom = require('./models').DoodleRoom;
let Doodle= require('./models').Doodle;

let router = new express.Router();

/**
 * Creates a Doodle Room and returns its meta data.
 *
 * @param {Request} req
 * @param {Response} res
 */
function createRoom(req, res) {
  if (!req.session.user) {
    res.sendStatus(401); return;
  }
  DoodleRoom.create({owner: req.session.user.userId})
    .then(function(room) {
      res.status(201).json(room);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
}

/**
 * Response with a list of active rooms and their members.
 *
 * @param {Request} req
 * @param {Response} res
 */
function getActiveRooms(req, res) {
  DoodleRoom.find({active: true})
    .then(function(rooms) {
      res.status(200).json(rooms);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
}

/**
 * Responds with a list of doodles.
 *
 * @param {Request} req
 * @param {Response} res
 */
function getDoodles(req, res) {
  Doodle.find()
    .then(function(doodles) {
      res.status(200).send(map(doodles, (doodle) => doodle.doodleId));
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
}

/**
 * Response with the contents of a published Doodle
 *
 * @param {Request} req
 * @param {Response} res
 */
function getDoodle(req, res) {
  Doodle.findOne({doodleId: req.body.doodleId})
    .then(function(doodle) {
      if (!doodle)
        res.sendStatus(404);
      else
        res.status(200).json(doodle);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
}

router.post('/createRoom', createRoom);
router.get('/getActiveRooms', getActiveRooms);
router.get('/getDoodles', getDoodles);
router.get('/getDoodle', getDoodle);

module.exports = router;
