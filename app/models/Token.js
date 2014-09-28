var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var TokenSchema = new Schema({
  token: {
    type: String,
    unique: true
  },

  groups: {
    type: Array
  },

  timesUsed: {
    type: Number,
    default: 0
  },

  maxUse: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Token', TokenSchema);