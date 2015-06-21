var Marionette = require('backbone.marionette');
var LoginView = require('./views/SocialLoginView');
var rootView = require('../../RootView');
var Backends = require('./models/SocialAuthBackends');

module.exports = {

    profile: function() {
    	var view = new LoginView();
    	rootView.showChildView('body', view);
    },

    login: function() {
        var backends = new Backends();
        var view = new LoginView({collection: backends});
        backends.fetch();
        rootView.showChildView('body', view);
    }
    
};
