var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var HomeView = require('./views/Home');
var AboutView = require('./views/About');
var app = require('../../App');
var rootView = require('../../RootView');


module.exports = Marionette.Controller.extend({
    initialize: function() {
    	//some init action
    },
    
    show: function() {
    	//just a placeholder
    },

    home: function() {
       // this.renderView(view);
    	console.log("displaying home");
    	var view = new HomeView();
    	rootView.showChildView('body', view);
    },
    
    about: function() {
     	var view = new AboutView();
     	rootView.showChildView('body', view);
     }
    
});
