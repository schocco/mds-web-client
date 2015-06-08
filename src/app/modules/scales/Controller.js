var Marionette = require('backbone.marionette');
var rootView = require('../../RootView');
var UxcView = require('./views/Uxc');
var UdhView = require('./views/Udh');

module.exports = Marionette.Controller.extend({

    uxc: function() {
    	var view = new UxcView();
    	rootView.showChildView('body', view);
    },

    udh: function() {
        var view = new UdhView();
        rootView.showChildView('body', view);
    }
    
});
