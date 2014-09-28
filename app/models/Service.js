var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var ServiceSchema = new Schema({
  name: {
    type: String,
    unique: true
  },

  username: {
    type: String
  },

  apiEndpoint: {
    type: String
  },

  domainName: {
    type: String
  }
});

module.exports = mongoose.model('Service', ServiceSchema);