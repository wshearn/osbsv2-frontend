// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.

var crud = [ 'index', 'show', 'edit', 'update' ];

function setupApiV1(parent) {
  /*
   * All v1 of the api will be CRUD.
   */
  parent.namespace('v1', function(){
    this.resources('applications', crud);
    this.resources('groups', crud);
    this.resources('services', crud);
    this.resources('tokens', crud);
    this.resources('users', crud);
  });
}

module.exports = function routes() {
  // Pages Controller
  this.root('pages#main');
  this.match('apidoc',      'pages#apidoc',    { via: 'get' });
  this.match('changelog',   'pages#changelog', { via: 'get' });

  // Users Controller
  this.match('register', 'users#register',  { via: 'get' });
  this.match('login',    'users#loginForm', { via: 'get' });
  this.match('login',    'users#login',     { via: 'post' });
  this.match('logout',   'users#logout');

  // Manage Controller
  this.match('services',     'manage#services',   { via: 'get'} );
  this.match('services/add', 'manage#addservice', { via: 'get'} );

  this.namespace('api', function() {
    setupApiV1(this);
  });
};
