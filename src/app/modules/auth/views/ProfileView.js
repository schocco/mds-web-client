var Marionette = require('backbone.marionette');
var tpl = require('../templates/profile.hbs');
var Radio = require('backbone.radio');

module.exports = Marionette.LayoutView.extend({
    template: tpl,
    modelEvents: {
        "sync": "render"
    },

    initialize: function(options) {
        Radio.channel("session").on("user:login:success", _.bind(this.updateCurrentUser, this));
    },

    updateCurrentUser: function() {
        this.model = Radio.channel("session").request("user:current");
        this.render();
    },

    regions: {
        user: "[data-region=user]",
        profile: "[data-region=profile]"
    }
});