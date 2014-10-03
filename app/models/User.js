"use strict";

var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },

  salt: {
    type: String,
    required: true
  },

  hash: {
    type: String,
    required: true
  },

  fullname: {
    type: String,
    default: "John Doe"
  },

  groups: [{
    type: Schema.ObjectId,
    ref: 'Group'
  }],

  token: [{
    type: Schema.ObjectId,
    ref: 'Token'
  }]
});

UserSchema.virtual('password', null).get(function(){
  return this._password;
}).set(function(password){
  this._password = password;
  this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, this.salt);
});

UserSchema.method('checkPassword', function(password, callback){
  bcrypt.compare(password, this.hash, callback);
});

UserSchema.static('authenticate', function (username, password, callback) {
  this.findOne({ username: username }, function(err, user) {
    if (err) {
      return callback(err);
    }
    else if (!user) {
      return callback(null, false);
    }

    user.checkPassword(password, function(err, passwordCorrect) {
      if (err) {
        return callback(err);
      }
      else if (!passwordCorrect) {
        return callback(null, false);
      }
      else {
        return callback(null, user);
      }
    });
  });
});

module.exports = mongoose.model('User', UserSchema);