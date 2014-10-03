"use strict";

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
  return helper.findAndUpdateObject(this.res, Token, this.req.param('id'), this.req.body);
};

tokensController.create = function create() {
  return helper.createObject(this.res, Token, this.req.body);
};

tokensController.destroy = function destroy() {
  return helper.findAndDestroy(this.res, Token, this.req.param('id'));
};

module.exports = tokensController;