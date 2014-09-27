var mongoose = require('mongoose')
  , bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },

  salt: {
    type: String,
    required: true
  },

  hash: {
    type: String,
    required: true
  }
});

UserSchema.virtual('password', null).get(function getPassword(){
  return this._password;
});

UserSchema.virtual('password', null).set(function setPassword(password){
  this._password = password;
  this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, this.salt);
});

UserSchema.method('checkPassword', function checkPassword(password, callback){
  bcrypt.compare(password, this.hash, callback);
});

UserSchema.static('authenticate', function authenticate(username, password, callback){

});

module.exports = mongoose.model('User', UserSchema);