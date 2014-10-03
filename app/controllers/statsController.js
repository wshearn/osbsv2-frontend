"use strict";

var locomotive = require('locomotive'),
    helpers    = require('../lib/helpers'),
    Controller = locomotive.Controller;

var statsController = new Controller();

statsController.main = function stats_main() {
  return helpers.genericPageRenderWithAuth('Statistics', this);
};

module.exports = statsController;
