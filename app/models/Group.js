var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var GroupSchema = new Schema({
  name: {
    type: String,
    unique: true
  }
});

module.exports = mongoose.model('Group', GroupSchema);