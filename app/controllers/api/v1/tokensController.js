var locomotive = require('locomotive'),
  helper     = require('../../../lib/api_helpers'),
  Controller = locomotive.Controller;

var Token = require('../../../models/Token');

function index() {
  var self = this;
  Token.find(function (err, tokens){
    return helper.generic(self.res, err, tokens);
  });
}

function show() {
  var self = this;
  Token.findOne({"_id": self.req.param('id')}, function (err, token){
    return helper.generic(self.res, err, token);
  });
}

function update() {
  var self = this;
  Token.findOne({"_id": self.req.param('id')}, function (err, token){
    if (err) {
      return helper.error(self.res, err);
    }

    token.name    = self.req.param('token') || token.token;
    token.groups  = self.req.param('groups') || token.groups;
    token.service = token.timesUsed;
    tokens.maxUse = self.req.param('maxUse') || token.maxUse;
    token.save(function (err){
      return helper.generic(self.res, err, token);
    });
  });
}

function destroy() {
  var self = this;
  Token.findOne({"_id": self.req.param('id')}, function (err, token){
    if (err) {
      return helper.error(self.res, err);
    }

    token.remove(function (err){
      helper.generic(self.res, err, {});
    });
  });
}

var tokensController = new Controller();
tokensController.index   = index;
tokensController.show    = show;
tokensController.update  = update;
tokensController.destroy = destroy;
module.exports = tokensController;