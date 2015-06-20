var Marionette = require('backbone.marionette');
var LoginView = require('./views/Login');
var rootView = require('../../RootView');

module.exports = {

    login: function() {
    	var view = new LoginView();
    	rootView.showChildView('body', view);
    },

    profile: function() {
        var view = new LoginView();
        rootView.showChildView('body', view);
    }
    
};
