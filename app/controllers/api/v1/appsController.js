var locomotive = require('locomotive'),
    helper     = require('../../../lib/api_helpers'),
    Controller = locomotive.Controller;

var Application = require('../../../models/Application');

function index() {
  var self = this;
  Application.find({}, function api_v1_apps_index(err, apps){
    return helper.generic(self.res, err, apps);
  });
}

function show() {
  var self = this;
  Application.findOne({_id: self.req.param('id')}, function api_v1_show_index(err, app){
    return helper.generic(self.res, err, app);
  });
}

var appsController = new Controller();
appsController.index = index;
appsController.show  = show;
module.exports = appsController;