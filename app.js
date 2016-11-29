var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var config = require('./config');
var db = require('./db');

var app = express();
app.use(bodyParser.urlencoded({'extended': true}));
app.use(bodyParser.json());
app.use(methodOverride());

// Load routes
app.use(require('./auth/routes'));

app.listen(config.env.PORT, function() {
  console.log(`listening on port ${config.env.PORT}`);
});
