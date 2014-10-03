"use strict";

var Group = require('../../app/models/Group');

function createAdminGroup(err, group) {
  if (err || !group) {
    var adminGroup = new Group({
      group: "admin"
    });
    adminGroup.save();
  }
}

module.exports = function() {
  Group.findOne({group: "admin"}, createAdminGroup);
};