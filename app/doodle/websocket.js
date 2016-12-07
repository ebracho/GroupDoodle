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
  User.findOne({userId: data.session.userId})
    .then((user) => {
      if (!user) {
        console.err('User not found!');
      }
      socket.client.user = user;
    })
    .catch((err) => {
      console.error(err);
    });
}

/**
 * Assigns event handlers to socket
 *
 * @param {Socket} socket
 */
function connection(socket) {
  // Ping-pong, for debugging
  socket.on('foo', function() {
    socket.emit('bar');
  });

  // Joins a Doodle room, emits all previous strokes recorded in redis.
  socket.on('joinRoom', function(room) {
    socket.join(room);
  });

  // Broadcasts a stroke to a room, records stroke to redis
  socket.on('stroke', function(room, stroke) {
    socket.broadcast.to(room).emit('stroke', stroke);
  });

  // Exits a Doodle room. If user was the room owner, closes the room
  socket.on('leaveRoom', function(room) {
    socket.leave(room);
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
