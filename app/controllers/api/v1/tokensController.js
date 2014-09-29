var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var Token = require('../../../models/Token');

var tokensController = new Controller();
tokensController.before('*', helper.isAuthenticated);

tokensController.index = function index() {
  return helper.findAndReturnObject(this.res, Token, null);
};

tokensController.show = function show() {
  return helper.findAndReturnObject(this.res, Token, this.req.param('id'));
};

tokensController.update = function update() {
  var self = this;
  Token.findOne({"_id": self.req.param('id')}, function (err, token){
    if (err) {
      return helper.error(self.res, err);
    }

    token.name   = self.req.param('token') || token.token;
    token.groups = self.req.param('groups') || token.groups;
    token.maxUse = self.req.param('maxUse') || token.maxUse;
    token.save(function (err){
      return helper.generic(self.res, err, token);
    });
  });
};

tokensController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Token, this.req.param('id'));
};

module.exports = tokensController;