var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var $ = require('jquery');

module.exports = {

    home: function() {
        //redirect to the home view
    	Backbone.history.navigate('home', { trigger: true, replace: true});
    },

    /**
     * Extract token from template.
     */
    setupCsrfHeader: function() {
        var token = $('meta[name=csrf-token]').attr("content");
        $.ajaxSetup({
            headers: {'X-CSRFToken': token}
        });
    }
    
};
