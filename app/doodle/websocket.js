'use strict';

let config = require('../config');
let redis = require('redis');
let socketio = require('socket.io');
let socketioAuth = require('socketio-auth');
let User = require('../auth/models').User;
let SessionToken = require('../auth/models').SessionToken;

let redisClient = redis.createClient({host: config.REDIS_HOST});

/*
 * - Group Doodle Websocket Control Flow -
 *
 * 1) User creates room, becomes the owner
 *
 * 2a) Strokes are recorded to redis, broadcast to room
 * 2b) New users join room, receive stroke history
 *
 * 3a) Owner closes room
 * 3b) Close signal is broadcast to room
 * 3c) Stroke history is saved and published as a Doodle
 *
 */

/**
 * Verifies that client provided a valid session token
 *
 * @param {Socket} socket
 * @param {Object} data
 * @param {Function} cb
 */
function authenticate(socket, data, cb) {
  SessionToken.findOne({token: data.session.token}, (err, sessionToken) => {
    if (err || !sessionToken) return cb(new Error('Invalid session token'));
    return cb(null, sessionToken.isValid());
  });
}

/**
 * Retrieves user and stores in socket.client object
 *
 * @param {Socket} socket
 * @param {Object} data
 */
function postAuthenticate(socket, data) {
  User.findOne({userId: data.session.userId}, function(err, user) {
    socket.client.user = user;
  });
}

/**
 * Assigns event handlers to socket
 *
 * @param {Socket} socket
 */
function connection(socket) {
  // Ping-pong
  socket.on('ping', function() {
    socket.emit('pong');
  });

  // Joins a Doodle room
  socket.on('joinRoom', function(room) {
  });

  // Broadcasts a stroke to a room
  socket.on('stroke', function(room, stroke) {
  });

  // Exits a Doodle room. If user was the room owner, closes the room
  socket.on('leaveRoom', function(room) {
  });
}

module.exports.listen = function(server) {
  let io = socketio.listen(server);
  socketioAuth(io, {
    authenticate: authenticate,
    postAuthenticate: postAuthenticate,
  });
  io.on('connection', connection);
  return io;
};
