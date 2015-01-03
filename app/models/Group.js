var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var GroupSchema = new Schema({
  group: {
    type: String,
    unique: true
  },

  admingroup: [{
    type: Schema.ObjectId,
    ref: 'Group'
  }]
});

module.exports = mongoose.model('Group', GroupSchema);