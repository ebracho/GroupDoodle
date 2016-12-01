'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let session = require('express-session');
let config = require('./config');
require('./db');

let app = express();

// Load middleware
app.use(bodyParser.urlencoded({'extended': true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Load routers
app.use(require('./auth/router'));
app.use(require('./frontend/router'));

// Listen for http connections
let server = app.listen(config.env.PORT, function() {
  console.log(`listening on port ${config.env.PORT}`);
});

// Load websocket handlers and listen for websocket connections
require('./doodle/websocket').listen(server);
