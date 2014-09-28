var locomotive = require('locomotive'),
    helpers    = require('../lib/helpers'),
    Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.main = function pages_main() {
  return helpers.genericPageRenderWithAuth('Locomotive', this);
};

module.exports = pagesController;
