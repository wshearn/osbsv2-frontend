"use strict";

var locomotive = require('locomotive'),
    mongoose   = require('mongoose'),
    helper     = require('../../../lib/api_helpers'),
    Controller = locomotive.Controller;

var Group = mongoose.model('Group');

var groupsController = new Controller();
groupsController.before('*', helper.isAuthenticated);

groupsController.index = function index() {
  return helper.findAndReturnObject(this.res, Group, null);
};

groupsController.show = function show() {
  return helper.findAndReturnObject(this.res, Group, this.req.param('id'));
};

groupsController.update = function update() {
  return helper.findAndUpdateObject(this.res, Group, this.req.param('id'), this.req.body);
};

groupsController.create = function create() {
  return helper.adminCreateObject(this.req, this.res, Group, null);
};

groupsController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Group, this.req.param('id'));
};

module.exports = groupsController;