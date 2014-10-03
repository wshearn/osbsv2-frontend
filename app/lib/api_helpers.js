var passport = require('passport');

function generic(res, err, data) {
  if (err) {
    return res.json(err);
  }

  return res.json(data);
}
exports.generic = generic;

function error(res, err) {
  return res.json({
    error: err
  });
}
exports.error = error;

function findAndReturnObject(res, Schema, id) {
  if (id === null) {
    Schema.find(function(err, objects){
      return generic(res, err, objects);
    });
  }
  else {
    Schema.findOne({"_id": id}, function(err, object){
      return generic(res, err, object);
    });
  }
}
exports.findAndReturnObject = findAndReturnObject;

function findAndUpdateObject(res, Schema, id, body) {
  Schema.findOne({"_id": id}, function (err, object){
    if (err) {
      return error(res, err);
    }

    for (var item in body) {
      if (object._doc.hasOwnProperty(item) && body.hasOwnProperty(item)) {
        if (object[item] !== body[item] &&
          typeof(object[item]) === typeof(body[item])) {
          object[item] = body[item];
        }
      }
    }

    object.save(function (err) {
      return generic(res, err, object);
    });
  });
}
exports.findAndUpdateObject = findAndUpdateObject;

function findAndDestroy(res, Schema, id) {
  Schema.findOne({"_id": id}, function(err, object){
    if (err) {
      return error(res, err);
    }

    object.remove(function (err){
      return generic(res, err, {});
    });
  });
}
exports.findAndDestroy = findAndDestroy;

function createObject(res, Schema, item) {
  var object = new Schema(item);
  if (item.password) {
    object.password = item.password;
  }
  object.save(function(err){
    return generic(res, err, object);
  });

}
exports.createObject = createObject;

exports.isAuthenticated = passport.authenticate(['requireuser', 'basic'], { session: false });

function AuthOrToken(req, res, next) {
  passport.authenticate(['requireuser', 'basic'], {session: false}, function(err, user, info){
    if (err) {
      return next(err);
    }
    if (!user && !req.body.token) {
      return res.send(401, 'Unauthorized');
    }

    if (user) {
      req.logIn(user, function(err){
        if (err) {
          console.log(err);
        }
      });
    }
    return next(err);
  })(req, res, next);
}
exports.AuthOrToken = AuthOrToken;