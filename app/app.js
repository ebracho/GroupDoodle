var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var mongoose = require('mongoose');
var config = require('./config');
var db = require('./db');

var app = express();

// Load middleware
app.use(bodyParser.urlencoded({'extended': true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

// Load routers
app.use(require('./auth/router'));

// Listen for http connections
var server = app.listen(config.env.PORT, function() {
  console.log(`listening on port ${config.env.PORT}`);
});

// Load websocket handlers and listen for websocket connections
require('./doodle/websocket').listen(server);
