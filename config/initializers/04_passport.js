var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , User = require('../../app/models/User');

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

passport.serializeUser(function serializeUser(user, done){
  return done(null, user._id);
});

passport.deserializeUser(function deserializeUser(id, done){
  User.findById(id, function findUsersId(){
    return done (err, user);
  });
})