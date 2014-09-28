var locomotive = require('locomotive'),
    helper     = require('../../../lib/api_helpers'),
    Controller = locomotive.Controller;

var Application = require('../../../models/Application');

function index() {
  var self = this;
  Application.find(function (err, apps){
    return helper.generic(self.res, err, apps);
  });
}

function show() {
  var self = this;
  Application.findOne({"_id": self.req.param('id')}, function (err, app){
    return helper.generic(self.res, err, app);
  });
}

function update() {
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
}

function destroy() {
  var self = this;
  Application.findOne({"_id": self.req.param('id')}, function (err, app){
    if (err) {
      return helper.error(self.res, err);
    }

    app.remove(function (err){
      helper.generic(self.res, err, {});
    });
  });
}

var appsController = new Controller();
appsController.index   = index;
appsController.show    = show;
appsController.update  = update;
appsController.destroy = destroy;
module.exports = appsController;