"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var ApplicationSchema = new Schema({
  application: {
    type: String
  },

  service: {
    type: Schema.ObjectId,
    ref: 'Service'
  },

  groups: [{
    type: Schema.ObjectId,
    ref: 'Group'
  }]
});

module.exports = mongoose.model('Application', ApplicationSchema);