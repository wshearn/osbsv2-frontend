"use strict";

module.exports = function() {
  this.set('port', 3000);
  this.set('ip', '127.0.0.1');
  this.set('cookie_secret', process.env.COOKIE_SECRET || 'supersecretpassword');
};
