var fs = require('fs');

module.exports = function setupMongoose() {
  this.mongoose = require('mongoose');
  this.mongoose.connect(this.set('db-uri'));
  this.mongooseTypes = require('mongoose-types');
  this.mongooseTypes.loadTypes(this.mongoose);

  // Init all of our models.
  var modelDir = __dirname + '/../../app/models/';
  fs.readdirSync(modelDir).forEach(function initModels(file){
    require(modelDir + file.replace('.js', ''));
  });
};