var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var ServiceSchema = new Schema({
  service: {
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
  },

  sshPrivKey: {
    type: String
  },

  sshPubKey: {
    type: String
  }
});

module.exports = mongoose.model('Service', ServiceSchema);