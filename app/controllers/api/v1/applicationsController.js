var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var Application = require('../../../models/Application');

var appsController = new Controller();
appsController.before('*', helper.isAuthenticated);

appsController.index = function index() {
  return helper.findAndReturnObject(this.res, Application, null);
};

appsController.show = function show() {
  return helper.findAndReturnObject(this.res, Application, this.req.param('id'));
};

appsController.update = function update() {
  var self = this;
  Application.findOne({"_id": self.req.param('id')}, function (err, app){
    if (err) {
      return helper.error(self.res, err);
    }

    app.name    = self.req.param('name') || app.name;
    app.groups  = self.req.param('groups') || app.groups;
    app.service = self.req.param('service') || app.service;
    app.save(function (err){
      return helper.generic(self.res, err, app);
    });
  });
};

appsController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Application, this.req.param('id'));
};

module.exports = appsController;