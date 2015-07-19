var Marionette = require('backbone.marionette');
var tpl = require('../templates/profile.hbs');
var Radio = require('backbone.radio');
var FileDropView = require('commons/views/FileDropView');
var MessageView = require('commons/views/Message');
var $ = require('jquery');
var _ = require('lodash');

module.exports = Marionette.LayoutView.extend({
    template: tpl,
    modelEvents: {
        "sync": "render"
    },

    initialize: function(options) {
       Radio.channel("session").on("user:login:success", _.bind(this.updateCurrentUser, this));
       this.listenTo(this.model, "change", this.render);
    },

    updateCurrentUser: function() {
        this.model = Radio.channel("session").request("user:current");
        this.model.trigger("sync");
    },

    regions: {
        picture: "[data-region=upload]",
        profile: "[data-region=profile]"
    },

    onDomRefresh: function() {
        //TODO: allow uploading new profile picture
    },

    showPictureUpload: function() {
        var uploadView = new FileDropView({
            url:  this.model.get("profile").resource_uri + "picture/",
            width: 100,
            name: "picture",
            single: true
        });
        uploadView.on("upload:done", _.bind(function(response) {
            this.processingMsg = new MessageView({
                el: "#uploadinfo",
                type: "info",
                message: "file is being processed...",
                timeout: 2000
            });
            this.processingMsg.show();
            var result = JSON.parse(response);
        }, this));
        uploadView.on("error", _.bind(function(error) {
            var result = JSON.parse(error.message);
            var msg = new MessageView({
                el: "#uploaderror",
                type: "error",
                message: result.error
            });
            msg.show();
        }, this));
        this.picture.show(uploadView);
    }

});