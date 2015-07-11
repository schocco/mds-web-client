var Marionette = require('backbone.marionette');
var LoginView = require('./views/SocialLoginView');
var rootView = require('../../RootView');
var Backends = require('./models/SocialAuthBackends');

module.exports = {

    profile: function() {
    	var view = new LoginView();
    	rootView.showChildView('body', view);
    },

    login: function(args) {
        var params = this.parseQueryString(args);
        var backends = new Backends();
        var view = new LoginView({collection: backends, next: params.next});
        backends.fetch();
        rootView.showChildView('body', view);
    },

    parseQueryString: function(str) {
        if(str) {
            return _.chain( str.split('&') )
                // Split each array item into [key, value]
                // ignore empty string if search is empty
                .map(function(item) { if (item) return item.split('='); })
                // Remove undefined in the case the search is empty
                .compact()
                // Turn [key, value] arrays into object parameters
                .object()
                // Return the value of the chain operation
                .value();
        } else {
            return {};
        }
    }
    
};
