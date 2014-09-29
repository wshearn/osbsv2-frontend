var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var Group = require('../../../models/Group');

function index() {
  return helper.findAndReturnObject(this.res, Group, null);
}

function show() {
  return helper.findAndReturnObject(this.res, Group, this.req.param('id'));
}

function update() {
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
}

function destroy() {
  return helper.findAndDestroy(this.res, Group, this.req.param('id'));
}

var groupsController = new Controller();
groupsController.index   = index;
groupsController.show    = show;
groupsController.update  = update;
groupsController.destroy = destroy;
module.exports = groupsController;