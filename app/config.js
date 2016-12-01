'use strict';

module.exports.env = {
  MONGODB_URL: process.env.MONGODB_URL || 'localhost',
  PORT: process.env.GROUP_DOODLE_PORT || 3000,
};
