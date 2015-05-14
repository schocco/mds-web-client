var Marionette = require('backbone.marionette');
var TrailCollection = require('./models/Trails');
var TrailListView = require('./views/Trails');
var TrailDetailView = require('./views/TrailDetail');
var rootView = require('../../RootView');

module.exports = Marionette.Controller.extend({
    initialize: function() {
    	//some init action
    },
    
    show: function() {
    	//just a placeholder
    },

    trailList: function() {
    	var trails = new TrailCollection();
    	var view = new TrailListView({collection: trails});
    	trails.fetch();
    	rootView.showChildView('body', view);
    },

    trailDetail: function() {
        var trails = new TrailCollection();
        var view = new TrailDetailView({collection: trails});
        trails.fetch();
        rootView.showChildView('body', view);
    }
    
});
