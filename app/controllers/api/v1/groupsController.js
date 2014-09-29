var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var Group = require('../../../models/Group');

var groupsController = new Controller();
groupsController.before('*', helper.isAuthenticated);

groupsController.index = function index() {
  return helper.findAndReturnObject(this.res, Group, null);
};

groupsController.show = function show() {
  return helper.findAndReturnObject(this.res, Group, this.req.param('id'));
};

groupsController.update = function update() {
  var self = this;
  Group.findOne({"_id": self.req.param('id')}, function (err, group){
    if (err) {
      return helper.error(self.res, err);
    }

    group.name = self.req.param('name') || group.name;
    group.save(function (err){
      return helper.generic(self.res, err, group);
    });
  });
};

groupsController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Group, this.req.param('id'));
};

module.exports = groupsController;