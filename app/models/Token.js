var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var TokenSchema = new Schema({
  token: {
    type: String,
    unique: true
  },

  groups: {
    type: Array
  }
});

module.exports = mongoose.model('Token', TokenSchema);