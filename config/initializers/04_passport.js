"use strict";

var passport            = require('passport'),
    LocalStrategy       = require('passport-local').Strategy,
    BasicStrategy       = require('passport-http').BasicStrategy,
    RequireUserStrategy = require('passport-requireuser').Strategy,
    User                = require('../../app/models/User');

function auth(username, password, done) {
  User.authenticate(username, password, function findUser(err, user){
    return done(err, user);
  });
}

passport.use(new LocalStrategy({ usernameField: 'username' }, auth));
passport.use(new BasicStrategy(auth));
passport.use(new RequireUserStrategy());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});