'use strict';

let mongoose = require('mongoose');
let config = require('./config');

mongoose.connect('mongodb://' + config.MONGODB_HOST + '/groupdoodle');

require('./auth/models');
require('./doodle/models');
