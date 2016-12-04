'use strict';
let shortid = require('shortid');

// Use url-friendly characters for ids
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);

module.exports = {
  MONGODB_HOST: process.env.MONGODB_HOST || 'localhost',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  PORT: process.env.GROUP_DOODLE_PORT || 3000,
};
