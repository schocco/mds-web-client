var Marionette = require('backbone.marionette');
var app = require('../../App');
var Router = require('./Router');
var Controller = require('./Controller');

var ScalesModule = Marionette.Module.extend({
  startWithParent: true,

  initialize: function(options, moduleName, app) {
	  //init
  },

  onStart: function(options) {
      console.log("scales module started");
  },

  onStop: function(options) {
    console.log("scales module stopped");
  }

});

ScalesModule.controller = Controller;
ScalesModule.router = new Router({controller : ScalesModule.controller});

module.exports = ScalesModule;
