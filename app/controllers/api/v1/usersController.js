var locomotive = require('locomotive'),
    helper     = require('../../../lib/api_helpers'),
    Controller = locomotive.Controller;

var User  = require('../../../models/User'),
    Group = require('../../../models/Group'),
    Token = require('../../../models/Token');

var usersController = new Controller();
usersController.before(['index', 'show', 'update', 'destroy'], helper.isAuthenticated);
usersController.before(['create'], helper.AuthOrToken);

usersController.index = function index() {
  return helper.findAndReturnObject(this.res, User, null);
};

usersController.show = function show() {
  return helper.findAndReturnObject(this.res, User, this.req.param('id'));
};

usersController.update = function update() {
  return helper.findAndUpdateObject(this.res, User, this.req.param('id'), this.req.body);
};

usersController.create = function create() {
  var self = this;
  if (typeof (this.req.param('token')) !== "undefined") {
    var usertoken = this.param('token') || this.body.token;
    Token.findOne({token: usertoken}, function(err, token){
      if (err || !token) {
        return self.res.send(401, 'Unauthorized');
      } else {
        self.req.body.token = [token.id];
        return helper.createObject(self.res, User, self.req.body);
      }
    });
  } else if (typeof (this.req.user) !== "undefined") {
    Group.findOne({group: "admin"}, function (err, group) {
      if (group === null || self.req.user._doc.groups.indexOf(group._doc._id) >= 0) {
        return helper.createObject(self.res, User, self.req.body);
      }
    });
  } else {
    return this.res.send(401, 'Unauthorized');
  }
};

usersController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, User, this.req.param('id'));
};

module.exports = usersController;