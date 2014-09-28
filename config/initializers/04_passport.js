var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User          = require('../../app/models/User');

passport.use(new LocalStrategy(
  {
    usernameField: 'username'
  },
  function auth(username, password, done) {
    User.authenticate(username, password, function findUser(err, user){
      return done(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});