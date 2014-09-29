var locomotive = require('locomotive'),
    passport   = require('passport'),
    helpers    = require('../lib/helpers'),
    Controller = locomotive.Controller;

var User  = require('../models/User'),
    Token = require('../models/Token');

// ---------------------------------------------
// Helper functions that are for this controller
// ---------------------------------------------
// TODO: Don't remove token but lock it instead
function updateOrRemoveToken(err, token) {
  if (err) {
    console.log(err);
  }
  else {
    token.timesUsed = token.timesUsed + 1;
    if (token.timesUsed >= token.maxUse) {
      token.remove(function(err){});
    }
    else {
      token.save(function(err){});
    }
  }
}

function createNewUser(user, res) {
  var newUser = new User(user);

  newUser.save(function saveErrorCheck(err){
    if (err) {
      console.log(err);
      return res.redirect('/register', 302);
    }
    else {
      Token.findOne({"_id": user.token}, function (err, token){
        updateOrRemoveToken(err, token);

        return res.redirect('/login', 302);
      });
    }
  });
}

// ---------------------------------------------
// Controller functions
// ---------------------------------------------

// -----------
// REST Routes
// -----------
function create() {
  var self = this;
  var token = self.param('token');

  Token.findOne({token: token}, function findRegToken(err, token){
    if (err || !token) {
      return self.res.redirect('/register', 401);
    }

    var newUser = {
      name:     self.param('name'),
      groups:   token.groups,
      username: self.param('username'),
      password: self.param('password'),
      token:    token.id
    };

    return createNewUser(newUser, self.res);
  });
}

// -----------
// Post Routes
// -----------
function login() {
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: this.urlFor({ action: 'login' }) }
  )(this.__req, this.__res, this.__next);
}


// -----------
// Get Routes
// -----------
function register() {
  this.render(null, null, null);
}

function loginForm() {
  if (this.req.isAuthenticated()) {
    return this.res.redirect(302, '/');
  }

  return helpers.genericPageRender(this, 'Login');
}

function logout() {
  this.req.logout();
  this.redirect('/', 302);
}

// ---------------------------------------------
// Controller exports
// ---------------------------------------------
var userController = new Controller();
userController.login     = login;
userController.logout    = logout;
userController.create    = create;
userController.register  = register;
userController.loginForm = loginForm;
module.exports = userController;