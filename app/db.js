'use strict';

let mongoose = require('mongoose');
let config = require('./config');

mongoose.connect('mongodb://' + config.env.MONGODB_URL + '/groupdoodle');

require('./auth/models');
require('./doodle/models');
