"use strict";

var locomotive = require('locomotive'),
    helpers    = require('../lib/helpers'),
    Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.main = function pages_main() {
  return helpers.genericPageRenderWithAuth('OpenShift Backup Service v2', this);
};

pagesController.apidoc = function pages_apidoc() {
  return helpers.genericPageRenderWithAuth('API Overview', this);
};

pagesController.changelog = function pages_changelog() {
  return helpers.genericPageRenderWithAuth('Changelog', this);
};


module.exports = pagesController;
