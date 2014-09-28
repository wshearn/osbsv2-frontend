var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var ApplicationSchema = new Schema({
  name: {
    type: String
  },

  service: {
    type: String
  },

  groups: {
    type: Array
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);