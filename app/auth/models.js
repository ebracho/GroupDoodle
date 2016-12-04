'use strict';

let mongoose = require('mongoose');
let crypto = require('crypto');
let shortid = require('shortid');

let userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => {
        return /^[0-9A-Za-z]{3,15}$/.test(v);
      },
    },
  },
  hash: String,
  salt: String,
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.save(); // Return promise
};

userSchema.methods.validatePassword = function(password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

// Session token used for authentication over websockets
let sessionTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate,
  },
  userId: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
    default: function() {
      let d = new Date();
      d.setDate(d.getDate() + 7);
      return d;
    },
  },
});

sessionTokenSchema.methods.expire = function() {
  this.expiration = new Date();
  this.save();
};

sessionTokenSchema.methods.isValid = function() {
  let now = new Date();
  return now < this.expiration;
};

let User = mongoose.model('User', userSchema);
let SessionToken = mongoose.model('SessionToken', sessionTokenSchema);

module.exports = {
  User: User,
  SessionToken: SessionToken,
};
