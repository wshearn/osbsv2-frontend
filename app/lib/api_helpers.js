"use strict";

var passport = require('passport'),
    mongoose = require('mongoose');

var Group = mongoose.model('Group');

/**
 * Simple wrapper function to handle returning data to the client.
 * @param {object} res - ExpressJS response object.
 * @param {(object|null)} err - If it is not null it returns error() See error
 * @param {object} data - KV object to return to the user in JSON format.
 */
function generic(res, err, data) {
  if (err) {
    return error(res, err);
  }

  return res.status(200).json(data);
}
exports.generic = generic;

/**
 * Lets be honest here, I am lazy and typing error() is easier then res.status(500).json(err)
 * @param {object} res - ExpressJS response object.
 * @param {object} err - Error message to return to the user
 */
function error(res, err) {
  return res.status(500).json(err);
}
exports.error = error;

/**
 * Removes specified keys from an object, does NOT save the record, only for display purposes where you don't want some
 * information being returned to the user.
 * @param {object} object - The object to filter
 * @param {(string[]|string)} filter - Keys to filter out of an object
 * @returns {object} object - Param object with keys in filter removed
 */
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

/**
 * Finds a record and returns it as a response to the client in json format.
 * @param {object} res - ExpressJS response object
 * @param {model} Schema - Mongoose model to search.
 * @param {(string|null)} [id] - ObjectID for the mongo record to return(Returns all if null)
 * @param {(string[]|string)} [filter=''] - Key or keys to remove from the output
 */
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

/**
 * Update mongo record with updatedObject, returns the object as a response to the client in json format.
 * @param {object} res - ExpressJS response object
 * @param {model} Schema - Mongoose model to search.
 * @param {string} id - ObjectID of the object to update.
 * @param {object} updatedObject - KV pairs to update in the mongo record. Validated at the model level
 */
function findAndUpdateObject(res, Schema, id, updatedObject) {
  Schema.findOne({"_id": id}, function (err, object){
    if (err) {
      return error(res, err);
    }

    for (var item in updatedObject) {
      if (object._doc.hasOwnProperty(item) && updatedObject.hasOwnProperty(item)) {
        if (object[item] !== updatedObject[item] &&
          typeof(object[item]) === typeof(updatedObject[item])) {
          object[item] = updatedObject[item];
        }
      }
    }

    object.save(function (err) {
      return generic(res, err, object);
    });
  });
}
exports.findAndUpdateObject = findAndUpdateObject;

/**
 * Find and destroys a mongo record, returns '{}' on success.
 * @param {object} res - ExpressJS response object
 * @param {model} Schema - Mongoose model to search.
 * @param {string} id - ObjectID of the object to destroy.
 */
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

/**
 * Creates a new mongo record
 * @param {object} res - ExpressJS response object
 * @param {model} Schema - Mongoose model to search.
 * @param {object} item - KV pair of the item to create. Validated at the model level.
 */
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

/**
 * Wrapper around createObject that checks to see if the user is in the admin
 * group
 * @param {object} res - ExpressJS response object
 * @param {object} user - ExpressJS user object
 * @param {model} Schema - Mongoose model to search.
 * @param {object} item - KV pair of the item to create. Validated at the model level.
 */
function adminCreateObject(res, user, Schema, item) {
  Group.findOne({group: "admin"}, function (err, group) {
    if (group !== null || user._doc.groups.indexOf(group._doc._id) >= 0) {
      return createObject(res, Schema, item);
    } else {
      return res.send(401, 'Unauthorized');
    }
  });
}
exports.adminCreateObject = adminCreateObject;

/**
 * Checks to see if a user is logged in OR if they have a token to allow them to continue. Token is validated at the
 * next level to allow multiple use cases.
 * @param {object} req - ExpressJS request object.
 * @param {object} res - ExpressJS response object.
 * @param {function} next - Callback to call after we have done our checks
 */
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

exports.isAuthenticated = passport.authenticate(['requireuser', 'basic'], { session: false });