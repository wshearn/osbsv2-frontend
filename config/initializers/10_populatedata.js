"use strict";

var mongoose = require('mongoose'),
    crypto   = require('crypto');

var Group = mongoose.model('Group'),
    Token = mongoose.model('Token');

function createAdminGroup(err, group) {
  if (err || !group) {
    var adminGroup = new Group({
      group: "admin"
    });
    adminGroup.save();
    createAdminToken(adminGroup.id);
  }
}

function createAdminToken(adminId) {
  // Generate a random 16 char one use admin id
  crypto.randomBytes(8, function(err, buf){
    var adminToken = new Token({
      token: buf.toString('hex'),
      groups: [adminId],
      timesUsed: 0,
      maxUse: 1
    });

    adminToken.save();

    console.log("Admin Token: " + adminToken.token);
  });
}

module.exports = function() {
  Group.findOne({group: "admin"}, createAdminGroup);
};