// load vendors
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');

// for the marionette inspector
if (window.__agent) {
	window.__agent.start(Backbone, Marionette);
}

// load modules
var Router = require('./Router.js');
var RootView = require('./RootView.js');
var Controller = require('./Controller.js');
var HomeModule = require('./modules/home/module.js');
var MscaleModule = require('./modules/mscale/module.js');


var App = Marionette.Application.extend({
	initialize : function(options) {
		console.log('app initialized.');
		this.rootView = RootView;
		this.rootView.render();
	},
	
	getRoot: function(){
		return this.rootView;
	}
});

var app = new App();

app.module("Home", HomeModule);
app.module("Mscale", MscaleModule);


//start history as soon as app is initialized
app.on("start", function(options) {
	app.router = new Router({
		controller : new Controller()
	});
	Backbone.history.start();
});


app.start();

module.exports = app;
