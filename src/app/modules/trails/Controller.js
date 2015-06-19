var Marionette = require('backbone.marionette');
var TrailCollection = require('./models/Trails');
var TrailModel = require('./models/Trail');
var TrailListView = require('./views/Trails');
//var TrailDetailView = require('./views/TrailDetail');
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

    trailDetail: function(trailId) {
        // split point to separate large openlayers library
        require(['./views/TrailDetail'], function(TrailDetailView) {
            var trail = new TrailModel({id: trailId});
            var view = new TrailDetailView({model: trail});
            trail.fetch();
            rootView.showChildView('body', view);
        });
    },

    /** lets users upload gpx files. */
    trailUpload: function() {

    }
    
});
