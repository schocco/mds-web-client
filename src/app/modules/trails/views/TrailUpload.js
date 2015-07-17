var Marionette = require('backbone.marionette');
var tpl = require('../templates/upload.hbs');
var MapView = require('map/views/MapView');
var FileDropView = require('commons/views/FileDropView');
var MessageView = require('commons/views/Message');
var Trail = require('trails/models/Trail');
var $ = require('jquery');
var _ = require('lodash');

/**
 * The main upload view.
 * Initially only shows the upload button and displays form and map when transformation of gpx to geojson completed.
 * If the gpx could not be transformed, the view stays unchanged but displays an error message.
 */
module.exports = Marionette.LayoutView.extend({
   template: tpl,

    regions: {
        upload: "[data-region=upload]",
        map: "[data-region=map]",
        form: "[data-region=form]"
    },

    trail: new Trail(),

    ui: {
        info: "#infoRow"
    },

    templateHelpers: {"trailTypes": ["xc", "downhill"]},

    triggers: {
      "click #saveBtn": "save:clicked"
    },

    processingMsg: null,

    /**
     * Display subviews.
     */
    onShow: function() {
        var uploadView = new FileDropView({
            url: "/api/v1/trails/load-gpx/",
            name: "gpx",
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
            this.pollForResult(result.result_uri);
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
        this.upload.show(uploadView);
    },

    /**
     * Submits the form.
     */
    onSaveClicked: function() {
        this.submitForm();
    },

    /**
     * Regularly polls the server for the geojson of the uploaded gpx file.
     * @param result_uri url where the result will be available on the server
     */
    pollForResult: function(result_uri){
        var url = result_uri;
        var that = this;
        var xhr = $.getJSON(url)
            .done(function(data, textStatus, xhr){
                if(xhr.status == 204){
                    setTimeout(function() {
                        that.pollForResult(result_uri);
                    }, 400);
                } else if(xhr.status == 200){
                    that.processingMsg.close();
                    that.trail.set({waypoints: data});
                    that.upload.reset(); // hide upload button
                    that.ui.info.show(300, _.bind(that.showMap, that));
                }
            })
            .fail(function(xhr){
                var msg = new MessageView({
                    el: "#uploaderror",
                    type: "error",
                    message: xhr.responseJSON.error
                });
                that.processingMsg.close(_.bind(msg.show, msg));
            });
    },

    /**
     * Stores the form values in the trail model and saves it on the server.
     * If successful, the user is redirected to the trail detail view to perform the rating.
     */
    submitForm: function() {
            var fields = $("#infoForm").serializeArray();
            $.each(fields, _.bind(function(i, field){
                this.trail.set(field.name, field.value);
            }, this));
            this.trail.save(null, {
                success: _.bind(this.showDetailView, this),
                error: _.bind(function(model, response) {
                    console.log(response);
                    var msg = new MessageView({
                        el: "#formErrors",
                        type: "error",
                        message: response.responseJSON.error
                    });
                    msg.show();
                }, this)
            });
    },

    /**
     * Redirects user to the trail detail view of the created trail.
     */
    showDetailView: function() {
        this.navigate(this.trail.getClientUri());
    },

    /**
     * Displays the uploaded trail on the map.
     */
    showMap: function() {
        var mapView = new MapView();
        mapView.addFeature(this.trail.get("waypoints"));
        //mapView.setStart(this.trail.get("start"));
        //mapView.setFinish(this.trail.get("finish"));
        this.map.show(mapView);
    }
});