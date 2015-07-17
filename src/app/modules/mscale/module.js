var Marionette = require('backbone.marionette');
var app = require('../../App');
var Router = require('./Router');
var Controller = require('./Controller');
var MscaleModule = Marionette.Module.extend({
  startWithParent: true,

  initialize: function(options, moduleName, app) {
	  //init
  },

  onStart: function(options) {
  	console.log("mscale module started");
  },

  onStop: function(options) {
    console.log("mscale module stopped");
  }
});

MscaleModule.controller = Controller;
MscaleModule.router = new Router({controller : MscaleModule.controller});

module.exports = MscaleModule;
