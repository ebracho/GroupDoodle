var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect('mongodb://' + config.env.MONGODB_URL + '/groupdoodle');

require('./auth/models');
