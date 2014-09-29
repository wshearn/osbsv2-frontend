var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var Service = require('../../../models/Service');

function index() {
  var self = this;
  Service.find(function (err, services){
    return helper.generic(self.res, err, services);
  });
}

function show() {
  var self = this;
  Service.findOne({"_id": self.req.param('id')}, function (err, service){
    return helper.generic(self.res, err, service);
  });
}

function update() {
  var self = this;
  Service.findOne({"_id": self.req.param('id')}, function (err, service){
    if (err) {
      return helper.error(self.res, err);
    }

    service.name        = self.req.param('name') || service.name;
    service.username    = self.req.param('username') || service.username;
    service.domainName  = self.req.param('domainName') || service.domainName;
    service.apiEndpoint = self.req.param('apiEndpoint') || service.apiEndpoint;
    service.save(function (err){
      return helper.generic(self.res, err, service);
    });
  });
}

function destroy() {
  var self = this;
  Service.findOne({"_id": self.req.param('id')}, function (err, service){
    if (err) {
      return helper.error(self.res, err);
    }

    service.remove(function (err){
      helper.generic(self.res, err, {});
    });
  });
}

var servicesController = new Controller();
servicesController.index   = index;
servicesController.show    = show;
servicesController.update  = update;
servicesController.destroy = destroy;
module.exports = servicesController;