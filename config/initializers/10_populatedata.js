var Group = require('../../app/models/Group');

function createAdminGroup(err, group) {
  if (err || !group) {
    var adminGroup = new Group({
      name: "admin"
    });
    adminGroup.save();
  }
}

module.exports = function() {
  Group.findOne({name: "admin"}, createAdminGroup);
};