"use strict";

var locomotive = require('locomotive'),
    mongoose   = require('mongoose'),
    helper     = require('../../../lib/api_helpers'),
    Controller = locomotive.Controller;

var Application = mongoose.model('Application');

var appsController = new Controller();
appsController.before('*', helper.isAuthenticated);

appsController.index = function index() {
  return helper.findAndReturnObject(this.res, Application, null);
};

appsController.show = function show() {
  return helper.findAndReturnObject(this.res, Application, this.req.param('id'));
};

appsController.update = function update() {
  return helper.findAndUpdateObject(this.res, Application, this.req.param('id'), this.req.body);
};

appsController.create = function create() {
  return helper.adminCreateObject(this.res, this.req.user, Application, this.req.body);
};

appsController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Application, this.req.param('id'));
};

module.exports = appsController;