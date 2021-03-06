'use strict';

let mongoose = require('mongoose');
let shortid = require('shortid');

// Contains images that were submitted from a doodle room
let doodleSchema = new mongoose.Schema({
  doodleId: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate,
  },
  illustrators: [{
    type: String,
    ref: 'User',
  }],
  strokes: [{
    _id: false,
    prvX: Number,
    prvY: Number,
    curX: Number,
    curY: Number,
    strokeStyle: String, // hexcode
    ts: Number,
    userId: String,
  }],
});

// Contains meta data for websocket doodle-rooms
let doodleRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate,
  },
  owner: {
    type: String,
    ref: 'User',
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

let Doodle = mongoose.model('Doodle', doodleSchema);
let DoodleRoom = mongoose.model('DoodleRoom', doodleRoomSchema);

module.exports = {
  Doodle: Doodle,
  DoodleRoom: DoodleRoom,
};
