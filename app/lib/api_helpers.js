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

function findObject(Schema, id, callback) {
  Schema.findOne({"_id": id}, function (err, object){
    return callback(err, object);
  });
}
exports.findObject = findObject;

function findAndDestroy(Schema, id) {
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

exports.isAuthenticated = passport.authenticate('basic', { session: false });