function requireAuth(req, res) {
  if (!req.isAuthenticated()) {
    res.redirect(302, '/login');
  }
}
exports.requireAuth = requireAuth;

function requireNoAuth(req, res) {
  if (req.isAuthenticated()) {
    res.redirect(302, '/');
  }
}
exports.requireNoAuth = requireNoAuth;

function genericPageRender(req, title, self) {
  self.user = req.user;
  self.title = title;

  self.render(null, null, null);
}
exports.genericPageRender = genericPageRender;