var mongoose   = require('mongoose');

var Group = mongoose.model('Group');

function requireAuth(self, cb) {
  if (!self.req.isAuthenticated()) {
    return self.res.redirect(302, '/login');
  }

  if (cb) {
   return cb(self);
  }
}
exports.requireAuth = requireAuth;

function forceNoAuth(self, cb) {
  if (self.req.isAuthenticated()) {
    return self.res.redirect(302, '/');
  }

  if (cb) {
    return cb(self);
  }
}
exports.forceNoAuth = forceNoAuth;

function genericPageRender(self, title) {
  if (title) {
    self.title = title;
  }

  if (self.req.user) {
    self.user = self.req.user;
    self.groups=[];

    Group.find({}, function(err, groups){
      groups.forEach(function(group){
        var index = self.user.groups.indexOf(group.id);
        if (index > -1) {
          self.user.groups[index] = group.group;
        }
      });
      return self.render(null, null, null);
    });
  } else {
    return self.render(null, null, null);
  }
}
exports.genericPageRender = genericPageRender;

function genericPageRenderWithAuth(title, self) {
  self.title = title;
  self.menu = self.app.menu;
  return requireAuth(self, genericPageRender);
}
exports.genericPageRenderWithAuth = genericPageRenderWithAuth;