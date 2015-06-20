var Marionette = require('backbone.marionette');
var MscaleCollection = require('./models/Mscales');
var MscaleView = require('./views/Mscales');
var rootView = require('../../RootView');

module.exports = {
    initialize: function() {
    	//some init action
    },
    
    show: function() {
    	//just a placeholder
    },

    mscale: function() {
    	var mscales = new MscaleCollection();
    	var view = new MscaleView({collection: mscales});
    	mscales.fetch();
    	rootView.showChildView('body', view);
    }
    
};
