'use strict';

let config = require('../config');
let redis = require('redis');
let socketio = require('socket.io');
let socketioAuth = require('socketio-auth');
let User = require('../auth/models').User;
let SessionToken = require('../auth/models').SessionToken;
let Doodle = require('./models').Doodle;
let DoodleRoom = require('./models').DoodleRoom;
let bluebird = require('bluebird');

let redisClient = redis.createClient({host: config.REDIS_HOST});
redisClient.on('error', (err) => {
  console.log('redisClient Error:', err);
});
// Promisify redis client as per
// https://github.com/NodeRedis/node_redis#promises
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

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
    redisClient.lrange(room, 0, -1, function(err, strokeStrings) {
      socket.emit('strokeHistory', strokeStrings.map(JSON.parse));
    });
  });

  // Broadcasts a stroke to a room, records stroke to redis with timestamp
  socket.on('stroke', function(room, stroke) {
    socket.broadcast.to(room).emit('stroke', stroke);
    stroke.ts = new Date().getTime();
    redisClient.lpush(room, JSON.stringify(stroke));
  });

  // Exits a Doodle room. If user was the room owner, closes the room
  socket.on('leaveRoom', function(room) {
    socket.leave(room);
  });

  // Publishes doodle and broadcasts terminate packet
  socket.on('publishDoodle', function(room) {
    // There is a bug that causes socket.client.user to be undefined
    // Until its fixed, we need to make sure it exists before accessing props.
    if (!socket.client.user) {
      console.error('Unauthorized user'); return;
    }
    DoodleRoom.findOne({roomId: room})
      // Authorize owner and retrieve strokes from redis
      .then((doodleRoom) => {
        if (!doodleRoom.owner === socket.client.user.userId) {
          throw new Error('Unauthorized user attempted to publish doodle.');
        }
        if (!doodleRoom.active) {
          throw new Error('Inactive doodle room cannot be published.');
        }
        doodleRoom.active = false;
        doodleRoom.save();
        return redisClient.lrangeAsync(room, 0, -1);
      })
      // Parse strokes and create Doodle.
      .then((strokes) => {
        let doodleProps = {
          doodleId: room,
          strokes: strokes.map(JSON.parse),
        };
        return Doodle.create(doodleProps);
      })
      // Emit terminate packet to room.
      .then((doodle) => {
        socket.in(room).emit('terminate', room);
        socket.emit('terminate', room);
      })
      .catch((err) => {
        console.error(err);
      });
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
