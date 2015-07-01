var Marionette = require('backbone.marionette');
var tpl = require('../templates/authPanel.hbs');
var Radio = require('backbone.radio');

module.exports = Marionette.LayoutView.extend({

    template: tpl,
    sessionChannel: Radio.channel("session"),

    initialize: function() {
        sessionChannel.on("login", this.render);
    },

    onRender: function() {
        // get current user and display appropriate content
    }
});