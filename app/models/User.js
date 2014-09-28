var mongoose = require('mongoose')
  , bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
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

  name: {
    type: String,
    default: "John Doe"
  },

  groups: {
    type: Array
  }
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
    if (err)
      return callback(err);

    if (!user)
      return callback(null, false);

    user.checkPassword(password, function(err, passwordCorrect) {
      if (err)
        return callback(err);

      if (!passwordCorrect)
        return callback(null, false);

      return callback(null, user);
    });
  });
});

module.exports = mongoose.model('User', UserSchema);