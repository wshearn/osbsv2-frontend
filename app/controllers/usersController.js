var locomotive = require('locomotive'),
    passport   = require('passport'),
    helpers    = require('../lib/helpers'),
    Controller = locomotive.Controller;

var User  = require('../models/User'),
    Token = require('../models/Token');

var userController = new Controller();

function errHelper(err) {
  console.log(err);
}
// TODO: Don't remove token but lock it instead
function updateOrRemoveToken(err, token) {
  if (err) {
    console.log(err);
  }
  else {
    token.timesUsed = token.timesUsed + 1;
    if (token.timesUsed >= token.maxUse) {
      token.remove(errHelper);
    }
    else {
      token.save(errHelper);
    }
  }
}

function createNewUser(user, res) {
  var newUser = new User(user);

  newUser.save(function saveErrorCheck(err){
    if (err) {
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

userController.create = function create() {
  var self = this;
  var usertoken = self.param('token') || self.body.token;

  Token.findOne({token: usertoken}, function findRegToken(err, token){
    if (err || !token) {
      return self.res.redirect('/register', 401);
    }

    var newUser = {
      fullname: self.param('fullname'),
      groups:   token.groups,
      username: self.param('username'),
      password: self.param('password'),
      token:    token.id
    };

    return createNewUser(newUser, self.res);
  });
};

userController.login = function login() {
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: this.urlFor({ action: 'login' }) }
  )(this.__req, this.__res, this.__next);
};

userController.register = function register() {
  this.render(null, null, null);
};

userController.loginForm = function loginForm() {
  if (this.req.isAuthenticated()) {
    return this.res.redirect(302, '/');
  }

  return helpers.genericPageRender(this, 'Login');
};

userController.logout = function logout() {
  this.req.logout();
  this.redirect('/', 302);
};

module.exports = userController;