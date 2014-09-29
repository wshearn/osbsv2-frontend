var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var User = require('../../../models/User');

var usersController = new Controller();
usersController.before('*', helper.isAuthenticated);

usersController.index = function index() {
  return helper.findAndReturnObject(this.res, User, null);
};

usersController.show = function show() {
  return helper.findAndReturnObject(this.res, User, this.req.param('id'));
};

usersController.update = function update() {
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
};

usersController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, User, this.req.param('id'));
};

module.exports = usersController;