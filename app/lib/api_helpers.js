"use strict";

var passport = require('passport');

function generic(res, err, data) {
  if (err) {
    return error(res, err);
  }

  return res.status(200).json(data);
}
exports.generic = generic;

function error(res, err) {
  return res.status(500).json(err);
}
exports.error = error;

function filterMongoose(object, filter) {
  if (!filter) {
    return object;
  }

  var filterOut = [];
  if (filter instanceof Array) {
    filterOut = filter;
  } else {
    filterOut.push(filter);
  }

  if (object !== null) {
    for (var currFilter = filterOut.length - 1; currFilter >= 0; --currFilter) {
      if (object._doc.hasOwnProperty(filterOut[currFilter])) {
        object[filterOut[currFilter]] = [];
      }
    }
  }

  return object;
}

function findAndReturnObject(res, Schema, id, filter) {

  if (id === null) {
    Schema.find(function(err, objects){
      var returnObj = [];
      objects.forEach(function(obj){
        returnObj.push(filterMongoose(obj, filter));
      });
      return generic(res, err, returnObj);
    });
  }
  else {
    Schema.findOne({"_id": id}, function(err, object){
      var returnObj = filterMongoose(object, filter);
      return generic(res, err, returnObj);
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
  passport.authenticate(['requireuser', 'basic'], {session: false}, function(err, user){
    if (err) {
      return next(err);
    }
    if (!user && !req.body.token) {
      return res.send(401, 'Unauthorized');
    }

    if (user) {
      req.logIn(user, function(err){
        if (err) {
          return next(err);
        }
      });
    }
    return next(err);
  })(req, res, next);
}
exports.AuthOrToken = AuthOrToken;