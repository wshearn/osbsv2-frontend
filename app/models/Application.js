var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var ApplicationSchema = new Schema({
  name: {
    type: String
  },

  service: {
    type: String
  },

  groups: [{
    type: Schema.ObjectId,
    ref: 'Group'
  }]
});

module.exports = mongoose.model('Application', ApplicationSchema);