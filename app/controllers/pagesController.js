var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.main = function pages_main() {
  this.title = 'Locomotive';
  this.render();
}

module.exports = pagesController;
