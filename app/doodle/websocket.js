var mongoose = require('mongoose');
var socketio = require('socket.io');
var socketioAuth = require('socketio-auth');
var shortid = require('shortid');
var User = mongoose.model('User');
var SessionToken = mongoose.model('SessionToken');

//
// - Group Doodle Websocket Control Flow -
//
// 1) User creates room, becomes the owner
//
// 2a) Strokes are recorded to redis, broadcast to room
// 2b) New users join room, receive stroke history
//
// 3a) Owner closes room
// 3b) Close signal is broadcast to room
// 3c) Stroke history is saved and published as a Doodle
//

// Verifies that client provided a valid session token
function authenticate(socket, data, cb) {
  SessionToken.findOne({token: data.token}, function(sessionToken) {
    if (err || !sesssionToken) return cb(new Error('Invalid session token'));
    return cb(null, sessionToken.verify());
  });
}

// Retrieves user and stores in socket.client object
function postAuthenticate(socket, data) {
  User.findOne({userId: data.userId}, function(err, user) {
    socket.client.user = user;
  });
}

// Assigns event handlers to socket
function connection(socket) {

  // Creates and joins a Doodle room, returns room meta data
  socket.on('createRoom', function() {
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
  var io = socketio.listen(server);
  socketioAuth(io, {
    authenticate: authenticate,
    postAuthenticate: postAuthenticate
  });
  io.on('connection', connection);
  return io;
};
