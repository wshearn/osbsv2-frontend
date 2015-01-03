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
      if (!err && adminGroup) {
        if (self.req.user._doc.groups.indexOf(adminGroup.id) > -1) {
          newGroup.admingroup.push(adminGroup.id);
          return helper.createObject(self.res, Group, newGroup, null);
        } else {
          return res.send(401, 'Unauthorized');
        }
      } else {
        return self.send(503, 'Server Error');
      }
    });
  } else {
    Group.findOne({ group: self.req.body + "_admin" }, function(err, group){
      if (!err && group) {
        if (self.req.user._doc.groups.indexOf(group.id) > -1 ||) {
          newGroup.admingroup.push(group.id);
          return helper.createObject(self.res, Group, newGroup, null);
        } else {
          Group.findOne({ group: "admin" }, function(err, adminGroup){
            if (!err && adminGroup && self.req.user._doc.groups.indexOf(adminGroup.id) > -1) {
                return helper.createObject(self.res, Group, newGroup, null);
            } else {
              return res.send(401, 'Unauthorized');
            }
          })
        }
      } else {
        Group.findOne({ group: "admin" }, function(err, adminGroup){
          if (!err && adminGroup) {
            if (self.req.user._doc.groups.indexOf(adminGroup.id) > -1) {
              var newAdminGroup = new Group({
                group: self.req.body.group + "_admin";
                admingroup: [adminGroup.id]
              });
              newAdminGroup.save();
              newGroup.admingroup.push(newAdminGroup.id);
              return helper.createObject(self.res, Group, newGroup, null);
            } else {
              return res.send(401, 'Unauthorized');
            }
          } else {
            return self.send(503, 'Server Error');
          }
        });
      }
    });
  }
};

groupsController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Group, this.req.param('id'));
};

module.exports = groupsController;