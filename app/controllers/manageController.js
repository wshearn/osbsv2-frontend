var locomotive = require('locomotive'),
    mongoose   = require('mongoose'),
    helpers    = require('../lib/helpers'),
    Controller = locomotive.Controller;

var Service  = mongoose.model('Service');

var manageController = new Controller();

manageController.services = function manage_services() {
  var self = this;
  self.activepageid = "service";

  Service.find({}, function getServices(err, services){
    if (err) {
      return self.res.send(503, err);
    } else {
      self.services = services;
      return helpers.genericPageRenderWithAuth('Manage Services', self);
    }
  });
};

manageController.addservice = function manage_addservice() {
  this.activepageid = "service";
  return helpers.genericPageRenderWithAuth('Add Service', this);
};

module.exports = manageController;
