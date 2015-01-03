var express        = require('express'),
    passport       = require('passport'),
    bodyParser     = require('body-parser'),
    cookieParser   = require('cookie-parser'),
    poweredBy      = require('connect-powered-by'),
    methodOverride = require('method-override'),
    SessionStore   = require('session-mongoose')(express);

function setupParsers(self) {
  self.use(cookieParser());
  self.use(bodyParser.urlencoded({ extended: true }));
  self.use(bodyParser.json());
}

function setupSession(self) {
  var store = new SessionStore({
    url: self.set('db-uri')
  });

  self.use(express.session({
    store:  store,
    secret: self.set('cookie_secret')
  }));
}

function setupMethodOverride(self) {
  self.use(methodOverride('X-HTTP-Method'));
  self.use(methodOverride('X-HTTP-Method-Override'));
  self.use(methodOverride('X-Method-Override'));
}

function setupPassport(self) {
  self.use(passport.initialize());
  self.use(passport.session());
}

module.exports = function() {
  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
  // middleware available as separate modules.
  if ('development' === this.env) {
    this.use(express.logger());
  }

  this.use(poweredBy('OpenShift'));
  this.use(express.static(__dirname + '/../../public'));

  setupParsers(this);
  setupSession(this);
  setupMethodOverride(this);
  setupPassport(this);

  this.use(this.router);
};
