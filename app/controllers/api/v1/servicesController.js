var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var Service = require('../../../models/Service');

var servicesController = new Controller();
servicesController.before('*', helper.isAuthenticated);

servicesController.index = function index() {
  return helper.findAndReturnObject(this.res, Service, null);
};

servicesController.show = function show() {
  return helper.findAndReturnObject(this.res, Service, this.req.param('id'));
};

servicesController.update = function update() {
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
};

servicesController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Service, this.req.param('id'));
};

module.exports = servicesController;