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
  return helper.findAndUpdateObject(this.res, User, this.req.param);
};

usersController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, User, this.req.param('id'));
};

module.exports = usersController;