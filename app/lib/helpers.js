exports.requireAuth = function requireAuth(self, cb) {
  if (!self.req.isAuthenticated()) {
    return self.res.redirect(302, '/login');
  }

  if (cb) {
   return cb(self);
  }
};

exports.genericPageRender = function genericPageRender(self, title) {
  if (title) {
    self.title = title;
  }

  if (self.req.user) {
    self.user = self.req.user;
  }

  return self.render(null, null, null);
};

exports.genericPageRenderWithAuth = function genericPageRenderWithAuth(title, self) {
  self.title = title;
  return requireAuth(self, genericPageRender);
};