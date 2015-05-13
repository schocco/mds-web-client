var Marionette = require('backbone.marionette');
var app = require('../../App');
var Router = require('./Router');
var Controller = require('./Controller');
var HomeModule = Marionette.Module.extend({
  startWithParent: true,

  initialize: function(options, moduleName, app) {
	  //init
  },

  onStart: function(options) {
  	console.log("home module started");
  	HomeModule.controller.show();
  },

  onStop: function(options) {
    console.log("home module stopped");
  }
});

HomeModule.controller = new Controller();
HomeModule.router = new Router({controller : HomeModule.controller});

module.exports = HomeModule;
