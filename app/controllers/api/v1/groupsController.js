"use strict";

var locomotive = require('locomotive'),
    mongoose   = require('mongoose'),
    helper     = require('../../../lib/api_helpers'),
    Controller = locomotive.Controller;

var Group = mongoose.model('Group');

var groupsController = new Controller();
groupsController.before('*', helper.isAuthenticated);

groupsController.index = function index() {
  return helper.findAndReturnObject(this.res, Group, null);
};

groupsController.show = function show() {
  return helper.findAndReturnObject(this.res, Group, this.req.param('id'));
};

groupsController.update = function update() {
  return helper.findAndUpdateObject(this.res, Group, this.req.param('id'), this.req.body);
};

groupsController.create = function create() {
  var self = this;

  var newGroup = {
    group: self.req.body.group,
    admingroup: []
  };

  if (newGroup.group.split("_")[newGroup.group.split("_").length-1] === "admin") {
    Group.findOne({ group: "admin" }, function(err, adminGroup){
      if (err || !adminGroup) {
        return self.send(503, 'Server Error');
      } else {
        newGroup.admingroup.push(adminGroup.id);
        return helper.adminCreateObject(self.req, self.res, Group, null, newGroup);
      }
    });
  } else {
    Group.findOne({ group: self.req.body + "_admin" }, function(err, group){
      if (err || !group) {
        Group.findOne({ group: "admin" }, function(err, adminGroup){
          var newAdminGroup = new Group({
            group: self.req.body.group + "_admin";
            admingroup: [adminGroup.id]
          });
          newAdminGroup.save();
          newGroup.admingroup.push(newAdminGroup.id);
          return helper.adminCreateObject(self.req, self.res, Group, null, newGroup);
        });
      } else {
        newGroup.admingroup.push(group.id);
        return helper.adminCreateObject(this.req, this.res, Group, null, newGroup);
      }
    });
  }
};

groupsController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Group, this.req.param('id'));
};

module.exports = groupsController;