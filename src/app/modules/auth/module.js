var Marionette = require('backbone.marionette');
var Router = require('./Router');
var Controller = require('./Controller');
var SessionManager = require('./models/SessionManager');
var AuthModule = Marionette.Module.extend({
  startWithParent: true,

  onStart: function(options) {
  	console.log("auth module started");
      AuthModule.sessionMgr.start();
  },


  onStop: function(options) {
    console.log("auth module stopped");
  }
});

AuthModule.controller = Controller;
AuthModule.router = new Router({controller : AuthModule.controller});
AuthModule.sessionMgr = new SessionManager();

module.exports = AuthModule;
