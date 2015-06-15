var Marionette = require('backbone.marionette');
var tpl = require('../templates/map.hbs');
var $ = require('jquery');
var ol = require("openlayers");
var css = require("openlayers/dist/ol.css");

/**
 * Table with details for a single mscale object.
 */
module.exports = Marionette.ItemView.extend({
	template: tpl,


    onShow: function() {
        var map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }),
            target: 'map',
            view: new ol.View({
                center: [0, 0],
                zoom: 2
            })
        });
    }

});