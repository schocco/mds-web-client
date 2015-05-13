var Marionette = require('backbone.marionette');
var Backbone = require('backbone');

module.exports = Marionette.Controller.extend({
    initialize: function() {
    	//some init action
    },

    home: function() {
       // this.renderView(view);
    	console.log("home route.");
    	Backbone.history.navigate('home', { trigger: true, replace: true});
    }
    
});
