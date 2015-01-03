var locomotive = require('locomotive'),
    mongoose   = require('mongoose'),
    helper     = require('../../../lib/api_helpers'),
    Controller = locomotive.Controller;

var Service = mongoose.model('Service');

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
  return helper.adminCreateObject(this.req, this.res, Service, null);
};

servicesController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Service, this.req.param('id'));
};

module.exports = servicesController;