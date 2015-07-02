var Marionette = require('backbone.marionette');
var tpl = require('../templates/authPanel.hbs');
var Radio = require('backbone.radio');
var UserWidget = require('./UserWidget');

/**
 * Authentication panel that shows the current authentication status.
 * When the user is logged in a userwidget is included.
 */
module.exports = Marionette.LayoutView.extend({

    template: tpl,
    sessionChannel: Radio.channel("session"),

    templateHelpers: function () {
        return {'authenticated': this.model.isAuthenticated()};
    },

    triggers: {
        "click #test": "test:clicked"
    },

    regions: {
        "userWidget": "[data-region=current-user]"
    },

    initialize: function() {
        this.sessionChannel.on("user:login:success", this.render);
        this.sessionChannel.on("user:login:error", this.render);
    },

    onBeforeRender: function() {
        // get current user to display appropriate content
        var user = this.sessionChannel.request("user:current");
        this.model = user;
    },

    onRender: function() {
        if(this.model.isAuthenticated()) {
            this.userWidget.show(new UserWidget({
                model: this.model,
                position: "bottom-left",
                buttonclass: "",
                showicon: false
            }));
        } else {
            this.userWidget.empty();
        }
    }

});