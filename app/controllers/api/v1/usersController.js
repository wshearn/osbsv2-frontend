

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

function usersAdminFunction(self, cb) {
  Group.findOne({group: "admin"}, function (err, group) {
    if (group === null || // If no admin group found, everyone is an admin
      self.req.user._doc.groups.indexOf(group.id) > -1 ||
      self.req.user.id === self.req.params.id) {
      return cb(self.res, User, self.req.param('id'), self.req.body);
    } else {
      return self.res.send(401, 'Unauthorized');
    }
  });
}

usersController.index = function index() {
  return helper.findAndReturnObject(this.res, User, null, filter);
};

usersController.show = function show() {
  return helper.findAndReturnObject(this.res, User, this.req.param('id'), filter);
};

usersController.update = function update() {
  return usersAdminFunction(this, helper.findAndUpdateObject);
};

usersController.create = function create() {
  var self = this;
  if (typeof (this.req.param('token')) !== "undefined") {
    var usertoken = this.param('token') || this.body.token;
    Token.findOne({token: usertoken}, function(err, token){
      if (!err && token && (token.timesUsed < token.maxUse)) {
        token.timesUsed++;
        token.save();

        self.req.body.token = [token.id];
        self.req.body.groups = token.groups;
        return helper.createObject(self.res, User, self.req.body, filter);
      } else {
        return self.res.send(401, 'Invalid token.');
      }
    });
  } else if (typeof (this.req.user) !== "undefined") {
    return helper.adminCreateObject(this.req, this.res, User, filter);
  } else {
    return this.res.send(401, 'No token specified.');
  }
};

usersController.destroy = function destroy() {
  return usersAdminFunction(this, helper.findAndDestroy);
};

module.exports = usersController;
