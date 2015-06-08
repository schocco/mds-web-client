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
var Router = require('./Router');
var RootView = require('./RootView');
var Controller = require('./Controller');
var HomeModule = require('home/module');
var MscaleModule = require('mscale/module');
var TrailModule = require('trails/module');

// use effects to transition contents
Marionette.Region.prototype.attachHtml = function(view){
	this.$el.hide();
	this.$el.html(view.el);
	this.$el.fadeIn(200);
};

var App = Marionette.Application.extend({
	initialize : function(options) {
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
app.module("Trails", TrailModule);


//start history as soon as app is initialized
app.on("start", function(options) {
	app.router = new Router({
		controller : new Controller()
	});
	Backbone.history.start();
});


app.start();

module.exports = app;
