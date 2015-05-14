var Marionette = require('backbone.marionette');
var app = require('../../App');
var Router = require('./Router');
var Controller = require('./Controller');
var TrailModule = Marionette.Module.extend({
  startWithParent: true,

  initialize: function(options, moduleName, app) {
	  //init
  },

  onStart: function(options) {
  	console.log("trail module started");
  	TrailModule.controller.show();
  },

  onStop: function(options) {
    console.log("trail module stopped");
  }

});

TrailModule.controller = new Controller();
TrailModule.router = new Router({controller : TrailModule.controller});

module.exports = TrailModule;
