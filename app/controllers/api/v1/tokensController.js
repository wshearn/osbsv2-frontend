var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var Token = require('../../../models/Token');

function index() {
  return helper.findAndReturnObject(this.res, Token, null);
}

function show() {
  return helper.findAndReturnObject(this.res, Token, this.req.param('id'));
}

function update() {
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
}

function destroy() {
  return helper.findAndDestroy(this.res, Token, this.req.param('id'));
}

var tokensController = new Controller();
tokensController.index   = index;
tokensController.show    = show;
tokensController.update  = update;
tokensController.destroy = destroy;
module.exports = tokensController;