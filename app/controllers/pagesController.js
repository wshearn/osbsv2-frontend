var locomotive = require('locomotive'),
    helpers    = require('../lib/helpers'),
    Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.main = function pages_main() {
  helpers.requireAuth(this.req, this.res);

  this.user = this.req.user;
  this.title = 'Locomotive';
  this.render(null, null, null);
};

module.exports = pagesController;
