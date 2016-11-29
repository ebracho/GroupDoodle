var mongoose = require('mongoose');
var crypto = require('crypto');
var shortid = require('shortid');

var userSchema = mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  hash: String,
  salt: String,
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  this.save();
};

userSchema.methods.validatePassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
}

var sessionTokenSchema = mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  expiration: {
    type: Date,
    required: true,
    default: function() {
      var d = new Date();
      d.setDate(d.getDate() + 7);
      return d;
    }
  }
});

sessionTokenSchema.methods.expire = function() {
  this.expiration = new Date();
  this.save();
};

sessionTokenSchema.methods.verify = function(token) {
  var now = new Date();
  return now < this.expiration && token === this.token;
};

var User = mongoose.model('User', userSchema);
var SessionToken = mongoose.model('SessionToken', sessionTokenSchema);

module.exports = {
  User: User,
  SessionToken: SessionToken
};
