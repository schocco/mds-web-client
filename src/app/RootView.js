var Marionette = require('backbone.marionette');
var tpl = require('./templates/index.hbs');
var AuthPanelView = require('auth/views/AuthPanelView');

/**
 * The RootView manages the complete page body and all its regions.
 * Instead of using the Application as the root of the view tree, this Layout View is used.
 * 
 * Modules can  render their views in the appropriate regions with 
 * require('<path to RootView>').showChildView('<region>', view); where
 */
var RootView = Marionette.LayoutView.extend({
	el: "body",
	template: false, //tpl,

	regions: {
	    header: '[data-region=header]', // Not used right now
		headerExtra: '[data-region=headerExtra]',
		authPanel: '[data-region=authPanel]',
	    body: '[data-region=body]',
	    footer: '[data-region=footer]' // Not used right now
	},
	
	onRender: function() {
		console.log("root view rendering");
		this.authPanel.show(new AuthPanelView());
	}

});

var rootView = new RootView();

module.exports = rootView;