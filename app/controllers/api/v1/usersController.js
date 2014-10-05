"use strict";

var locomotive = require('locomotive'),
    mongoose   = require('mongoose'),
    helper     = require('../../../lib/api_helpers'),
    Controller = locomotive.Controller;

var User  = mongoose.model('User'),
    Group = mongoose.model('Group'),
    Token = mongoose.model('Token');

var usersController = new Controller();
usersController.before(['index', 'show', 'update', 'destroy'], helper.isAuthenticated);
usersController.before(['create'], helper.AuthOrToken);

var filter = ['hash', 'salt', 'token'];

usersController.index = function index() {
  return helper.findAndReturnObject(this.res, User, null, filter);
};

usersController.show = function show() {
  return helper.findAndReturnObject(this.res, User, this.req.param('id'), filter);
};

usersController.update = function update() {
  var self = this;
  Group.findOne({group: "admin"}, function (err, group) {
    if (group === null ||
      self.req.user._doc.groups.indexOf(group._doc._id) >= 0 ||
      self.req.user.id === self.req.params.id) {
      return helper.findAndUpdateObject(this.res, User, this.req.param('id'), this.req.body);
    } else {
      return self.res.send(401, 'Unauthorized');
    }
  });
};

usersController.create = function create() {
  var self = this;
  if (typeof (this.req.param('token')) !== "undefined") {
    var usertoken = this.param('token') || this.body.token;
    Token.findOne({token: usertoken}, function(err, token){
      if (!err && token) {
        self.req.body.token = [token.id];
        return helper.createObject(self.res, User, self.req.body);
      } else {
        return self.res.send(401, 'Unauthorized');
      }
    });
  } else if (typeof (this.req.user) !== "undefined") {
    Group.findOne({group: "admin"}, function (err, group) {
      if (group === null || self.req.user._doc.groups.indexOf(group._doc._id) >= 0) {
        return helper.createObject(self.res, User, self.req.body);
      } else {
        return self.res.send(401, 'Unauthorized');
      }
    });
  } else {
    return this.res.send(401, 'Unauthorized');
  }
};

usersController.destroy = function destroy() {
  var self = this;
  Group.findOne({group: "admin"}, function (err, group) {
    if (group === null ||
        self.req.user._doc.groups.indexOf(group._doc._id) >= 0 ||
        self.req.user.id === self.req.params.id) {
      return helper.findAndDestroy(self.res, User, self.req.param('id'));
    } else {
      return self.res.send(401, 'Unauthorized');
    }
  });
};

module.exports = usersController;