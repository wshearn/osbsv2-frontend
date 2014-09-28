var locomotive = require('locomotive'),
    helpers    = require('../lib/helpers'),
    Controller = locomotive.Controller;

var statsController = new Controller();

statsController.main = function stats_main() {
  helpers.requireAuth(this.req, this.res);

  this.user = this.req.user;
  this.title = 'Statistics';
  this.render(null, null, null);
};

module.exports = statsController;
