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
    res.sendStatus(401);
  } else {
    DoodleRoom.create({owner: req.session.user.userId}, function(err, room) {
      res.status(201).json(room);
    });
  }
}

/**
 * Response with a list of active rooms and their members.
 *
 * @param {Request} req
 * @param {Response} res
 */
function getActiveRooms(req, res) {
  DoodleRoom.find({active: true}, function(err, rooms) {
    res.status(200).json({rooms});
  });
}

/**
 * Responds with a list of doodles.
 *
 * @param {Request} req
 * @param {Response} res
 */
function getDoodles(req, res) {
  Doodle.find({}, function(err, doodles) {
    res.status(200).send(map(doodles, (doodle) => doodle.doodleId));
  });
}

/**
 * Response with the contents of a published Doodle
 *
 * @param {Request} req
 * @param {Response} res
 */
function getDoodle(req, res) {
  Doodle.findOne({doodleId: req.body.doodleId}, function(err, doodle) {
    if (!doodle) {
      res.sendStatus(404);
    } else {
      res.status(200).json(doodle);
    }
  });
}

router.post('/createRoom', createRoom);
router.get('/getActiveRooms', getActiveRooms);
router.get('/getDoodles', getDoodles);
router.get('/getDoodle', getDoodle);

module.exports = router;
