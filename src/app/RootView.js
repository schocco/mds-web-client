var Marionette = require('backbone.marionette');
var tpl = require('./templates/index.hbs');
var AuthPanelView = require('auth/views/AuthPanelView');
var Radio = require('backbone.radio');
var Message = require('commons/views/Message');

/**
 * The RootView manages the complete page body and all its regions.
 * Instead of using the Application as the root of the view tree, this Layout View is used.
 * 
 * Modules can  render their views in the appropriate regions with 
 * require('<path to RootView>').showChildView('<region>', view); where
 */
var RootView = Marionette.LayoutView.extend({
	el: "body",
	template: false,

    notificationChannel: Radio.channel("notification"),

	regions: {
	    header: '[data-region=header]', // Not used right now
		headerExtra: '[data-region=headerExtra]',
		authPanel: '[data-region=authPanel]',
		notification: "[data-region=notification]",
	    body: '[data-region=body]',
	    footer: '[data-region=footer]' // Not used right now
	},

	initialize: function() {
		//set up listener
        this.notificationChannel.on("notification:show", this.showNotification);
	},

    showNotification: function(message, type) {
        var msg = new Message({el: "#notification", type:type, wrapper:"p",message:message, timeout: 20000});
        msg.show();
    },
	
	onRender: function() {
		console.log("root view rendering");
		this.authPanel.show(new AuthPanelView());
	}

});

var rootView = new RootView();

module.exports = rootView;