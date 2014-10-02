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
  return helper.findAndUpdateObject(this.res, Service, this.req.param('id'), this.req.body);
};

servicesController.create = function create() {
  return helper.createObject(this.res, Service, this.req.body);
};

servicesController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Service, this.req.param('id'));
};

module.exports = servicesController;