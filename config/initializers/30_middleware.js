var express = require('express')
  , passport = require('passport')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , poweredBy = require('connect-powered-by')
  , methodOverride = require('method-override')
  , SessionStore = require('session-mongoose')(express);

module.exports = function() {
  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
  // middleware available as separate modules.
  if ('development' == this.env) {
    this.use(express.logger());
  }

  var store = new SessionStore({
    url: this.set('db-uri')
  });
  this.use(poweredBy('OpenShift'));
  this.use(express.static(__dirname + '/../../public'));
  this.use(cookieParser());
  this.use(bodyParser.urlencoded({ extended: true }));
  this.use(bodyParser.json());
  this.use(express.session({
    store:  store,
    secret: this.set('cookie_secret')
  }));
  this.use(methodOverride('X-HTTP-Method'));
  this.use(methodOverride('X-HTTP-Method-Override'));
  this.use(methodOverride('X-Method-Override'));

  this.use(passport.initialize());
  this.use(passport.session());

  this.use(this.router);
};
