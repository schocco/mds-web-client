var Marionette = require('backbone.marionette');
var tpl = require('../templates/upload.hbs');
var MapView = require('map/views/MapView');
var FileDropView = require('commons/views/FileDropView');
var MessageView = require('commons/views/Message');
var Trail = require('trails/models/Trail');
var $ = require('jquery');

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

    onShow: function() {
        var uploadView = new FileDropView({
            url: "/api/v1/trails/load-gpx/",
            name: "gpx",
            single: true
        });
        var msg = new MessageView({
            el: "#uploadmessage",
            type: "info",
            message: "file is being processed",
            timeout: 900
        });
        uploadView.on("upload:done", _.bind(function(response) {
            msg.show();
            this.upload.reset();
            var result = JSON.parse(response);
            this.pollForResult(result.task_id);
            this.ui.info.show(300);
        }, this));
        this.upload.show(uploadView);
    },

    onSaveClicked: function() {
        this.submitForm();
    },

    pollForResult: function(task_id){
        var url = this.trail.urlRoot + "load-gpx/result/" + task_id + "/";
        var that = this;
        var xhr = $.getJSON(url)
            .done(function(data, textStatus, xhr){
                if(xhr.status == 204){
                    console.log("try again");
                    setTimeout(function() {
                        that.pollForResult(task_id);
                    }, 400);
                } else if(xhr.status == 200){
                    that.trail.set({waypoints: data});
                    that.showMap();
                }
            })
            .fail(function(xhr){
                that.showMessage({msg:xhr.responseJSON.error, type:that.ERROR});
            });
    },

    submitForm: function() {
            var fields = $("#infoForm").serializeArray();
            $.each(fields, _.bind(function(i, field){
                this.trail.set(field.name, field.value);
            }, this));
            this.trail.save();
    },

    showMap: function() {
        var mapView = new MapView();
        mapView.addFeature(this.trail.get("waypoints"));
        //mapView.setStart(this.trail.get("start"));
        //mapView.setFinish(this.trail.get("finish"));
        this.map.show(mapView);
    }
});