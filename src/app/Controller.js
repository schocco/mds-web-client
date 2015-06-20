var Marionette = require('backbone.marionette');
var Backbone = require('backbone');

module.exports = {

    home: function() {
        //redirect to the home view
    	Backbone.history.navigate('home', { trigger: true, replace: true});
    }
    
};
