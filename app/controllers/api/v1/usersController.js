var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var User = require('../../../models/User');

function index() {
  var self = this;
  User.find(function (err, users){
    return helper.generic(self.res, err, users);
  });
}

function show() {
  var self = this;
  User.findOne({"_id": self.req.param('id')}, function (err, user){
    return helper.generic(self.res, err, user);
  });
}

function update() {
  var self = this;
  User.findOne({"_id": self.req.param('id')}, function (err, user){
    if (err) {
      return helper.error(self.res, err);
    }

    user.username = self.req.param('username') || user.username;
    user.name     = self.req.param('name') || user.name;
    user.groups   = self.req.param('groups') || user.groups;
    user.token    = self.req.param('token') || user.token;
    user.password = self.req.param('password') || user.password;
    user.save(function (err){
      return helper.generic(self.res, err, user);
    });
  });
}

function destroy() {
  var self = this;
  User.findOne({"_id": self.req.param('id')}, function (err, user){
    if (err) {
      return helper.error(self.res, err);
    }

    user.remove(function (err){
      helper.generic(self.res, err, {});
    });
  });
}

var usersController = new Controller();
usersController.index   = index;
usersController.show    = show;
usersController.update  = update;
usersController.destroy = destroy;
module.exports = usersController;