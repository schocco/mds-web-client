var Marionette = require('backbone.marionette');
var app = require('../../App');
var Router = require('./Router');
var Controller = require('./Controller');
var AuthModule = Marionette.Module.extend({
  startWithParent: true,

  initialize: function(options, moduleName, app) {
	  //init
  },

  onStart: function(options) {
  	console.log("auth module started");
  },

  onStop: function(options) {
    console.log("auth module stopped");
  }
});

AuthModule.controller = Controller;
AuthModule.router = new Router({controller : AuthModule.controller});

module.exports = AuthModule;
