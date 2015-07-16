var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var $ = require('jquery');
var cookie = require('jquery.cookie');

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
        token = $.cookie('csrftoken');
        $.ajaxSetup({
            headers: {'X-CSRFToken': token}
        });
    }
    
};
