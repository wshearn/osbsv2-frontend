var locomotive = require('locomotive'),
    passport   = require('passport'),
    helpers    = require('../lib/helpers'),
    lodash     = require('lodash'),
    Controller = locomotive.Controller;

var User  = require('../models/User'),
    Token = require('../models/Token');

// ---------------------------------------------
// Helper functions that are for this controller
// ---------------------------------------------
function createNewUser(user, res) {
  var newUser = new User(user);

  newUser.save(function saveErrorCheck(err){
    if (err) {
      return res.redirect('/register', 302);
    }

    return res.redirect('/login', 302);
  });
}

// ---------------------------------------------
// Controller functions
// ---------------------------------------------

// -----------
// REST Routes
// -----------
function user_create() {
  // TODO unique token for registering
  var self = this;
  var token = self.param('token');
  var groups = ['authenticated'];

  Token.findOne({token: token}, function findRegToken(err, token){
    if (err || !token) {
      return self.res.redirect('/register', 401);
    }

    groups = lodash.union(groups, token.groups);

    var newUser = {
      name:     self.param('name'),
      groups:   groups,
      username: self.param('username'),
      password: self.param('password')
    };

    return createNewUser(newUser, self.res);
  });
}

// -----------
// Post Routes
// -----------
function user_login() {
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: this.urlFor({ action: 'login' }) }
  )(this.__req, this.__res, this.__next);
}


// -----------
// Get Routes
// -----------
function user_show() {
  helpers.requireAuth(this.req, this.res);

  this.user = this.req.user;
  this.render(null, null, null);
}

function user_register() {
  this.render(null, null, null);
}

function user_login_form() {
  helpers.requireNoAuth(this.req, this.res);

  this.render(null, null, null);
}

function user_logout() {
  this.req.logout();
  this.redirect('/', 302);
}

// ---------------------------------------------
// Controller exports
// ---------------------------------------------
var userController = new Controller();
userController.show      = user_show;
userController.login     = user_login;
userController.logout    = user_logout;
userController.create    = user_create;
userController.register  = user_register;
userController.loginForm = user_login_form;
module.exports = userController;