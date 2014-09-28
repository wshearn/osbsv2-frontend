var locomotive = require('locomotive'),
    helpers    = require('../lib/helpers'),
    Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.main = function pages_main() {
  helpers.requireAuth(this.req, this.res);
  helpers.genericPageRender(this.req, 'Locomotive', this);
};

module.exports = pagesController;
