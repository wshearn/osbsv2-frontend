var socketio         = require('socket.io')
  , express          = require('express')
  , cookieParser     = require('cookie-parser')
  , SessionStore     = require('session-mongoose')(express)
  , passportSocketIo = require('passport.socketio');

// ---------------------------------------------
// Socket IO functions
// ---------------------------------------------
function sio_helloWorld(socket, data){
  socket.emit('ack', data);
}
// ---------------------------------------------
// End Socket IO functions
// ---------------------------------------------

function onAuthorizeSuccess(data, accept){
  accept();
}

function onAuthorizeFail(data, message, error, accept){
  if(error)
    accept(new Error(message));
}

module.exports = function() {
  this.io = socketio.listen(this.httpServer);

  var store = new SessionStore({
    url: this.set('db-uri')
  });

  this.io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:          "connect.sid",
    secret:       this.set('cookie_secret'),
    store:        store,
    success:      onAuthorizeSuccess,
    fail:         onAuthorizeFail
  }));

  this.io.sockets.on('connection', function(socket){
    socket.on('hello', function(data){ sio_helloWorld(socket, data) });
  });
};