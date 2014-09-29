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
  return helper.findAndUpdateObject(this.res, Application, this.req.param('id'), this.req.body);
};

appsController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Application, this.req.param('id'));
};

module.exports = appsController;