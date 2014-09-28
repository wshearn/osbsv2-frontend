var locomotive = require('locomotive'),
    helpers    = require('../lib/helpers'),
    Controller = locomotive.Controller;

var statsController = new Controller();

statsController.main = function stats_main() {
  helpers.requireAuth(this.req, this.res);
  helpers.genericPageRender(this.req, 'Statistics', this);
};

module.exports = statsController;
