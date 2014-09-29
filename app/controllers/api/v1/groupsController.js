var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var Group = require('../../../models/Group');

function index() {
  var self = this;
  Group.find(function (err, groups){
    return helper.generic(self.res, err, groups);
  });
}

function show() {
  var self = this;
  Group.findOne({"_id": self.req.param('id')}, function (err, group){
    return helper.generic(self.res, err, group);
  });
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
  var self = this;
  Group.findOne({"_id": self.req.param('id')}, function (err, group){
    if (err) {
      return helper.error(self.res, err);
    }

    group.remove(function (err){
      helper.generic(self.res, err, {});
    });
  });
}

var groupsController = new Controller();
groupsController.index   = index;
groupsController.show    = show;
groupsController.update  = update;
groupsController.destroy = destroy;
module.exports = groupsController;