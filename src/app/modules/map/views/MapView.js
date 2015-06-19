var Marionette = require('backbone.marionette');
var tpl = require('../templates/map.hbs');
var $ = require('jquery');
var ol = require("openlayers");
var mapStyles = require('./MapStyles');
var css = require("openlayers/dist/ol.css");
var IconBuilder = require('../icons/IconBuilder');

/**
 * Mapview for displaying features on an OSM map.
 */
module.exports = Marionette.ItemView.extend({
    template: tpl,
    profileViewOptions: ['zoom', 'center'],
    map: null,
    vectorSource: new ol.source.Vector({features: []}),
    vectorLayer: null,
    /**
     * Default view of the map.
     */
    view: new ol.View({
        center: [0, 0],
        zoom: 3
    }),

    triggers: {
        "click #btnCycling": "layer:selected:cycling",
        "click #btnLandscape": "layer:selected:landscape",
        "click #btnOSM": "layer:selected:osm"
    },

    layers: {
        "osm": new ol.layer.Tile({
            source: new ol.source.OSM(),
            visible: false
        }),
        "cycling": new ol.layer.Tile({
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'Maps &copy; <a href="http://www.thunderforest.com">Thunderforest</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                url: 'http://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png'
            }),
            visible: true // default layer
        }),
        "landscape": new ol.layer.Tile({
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'Maps &copy; <a href="http://www.thunderforest.com">Thunderforest</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                url: 'http://{a-c}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'
            }),
            visible: false
        })
    },

    hideLayers: function () {
        _.forEach(this.layers, function (val, key) {
            val.setVisible(false);
        }, this);
        $("#layerButtons>a").removeClass("button-active");
    },


    onLayerSelectedCycling: function () {
        this.hideLayers();
        $("#btnCycling").addClass("button-active");
        this.layers.cycling.setVisible(true);
    },

    onLayerSelectedLandscape: function () {
        this.hideLayers();
        $("#btnLandscape").addClass("button-active");
        this.layers.landscape.setVisible(true);
    },

    onLayerSelectedOsm: function () {
        this.hideLayers();
        $("#btnOSM").addClass("button-active");
        this.layers.osm.setVisible(true);
    },

    initialize: function (options) {
        this.mergeOptions(options, this.profileViewOptions);
        this.vectorLayer = new ol.layer.Vector({
            source: this.vectorSource,
            style: this.styleFunction
        });

    },

    onShow: function () {
        this.showMap();
        this.zoomToContent();
    },

    /**
     * Iterates all features from the vectorSource to set the min and max values for the extent.
     * The extent will be chosen, so that all features will be visible on the map.
     * An additional small padding is applied on all corners.
     */
    zoomToContent: function () {
        this.vectorSource.forEachFeature(function (feature) {
            var extent = feature.getGeometry().getExtent();
            if (this.finalExtent === null) {
                this.finalExtent = extent;
            } else {
                // set min values for x and y
                this.finalExtent[0] = Math.min(extent[0], this.finalExtent[0]);
                this.finalExtent[1] = Math.min(extent[1], this.finalExtent[1]);
                // set max values for x and y
                this.finalExtent[2] = Math.max(extent[2], this.finalExtent[2]);
                this.finalExtent[3] = Math.max(extent[3], this.finalExtent[3]);
            }
        }, this);
        // add some extra space
        var padding = 3;
        this.finalExtent[0] = this.finalExtent[0] - padding;
        this.finalExtent[1] = this.finalExtent[1] - padding;
        this.finalExtent[2] = this.finalExtent[2] + padding;
        this.finalExtent[3] = this.finalExtent[3] + padding;
        this.view.fitExtent(this.finalExtent, this.map.getSize()); //XXX: fitExtent() is not stable, review before ol update
    },

    finalExtent: null,


    /**
     * Creates a new ol.map object and renders it in the #map dom element using
     * the views layer.
     */
    showMap: function () {
        this.map = new ol.Map({
            layers: [
                this.layers.cycling,
                this.layers.osm,
                this.layers.landscape,
                this.vectorLayer
            ],
            target: 'map',
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }),
            view: this.view
        });
    },

    /**
     * Adds a feature to the map layer and transforms it from WGS84 to the appropriate map projection.
     * @param geoJson the geometry object
     * @param geoJson.type type of the geometry (e.g. "LineString")
     * @param geoJson.coordinates an array with coordinates for this geometry
     */
    addFeature: function (geoJson) {
        var feature = this.transform(geoJson);
        this.vectorSource.addFeature(feature);
    },

    /**
     *
     * @param geom
     * @return {ol.Feature}
     */
    transform: function (geom) {
        var wgs84geojson = new ol.format.GeoJSON({defaultDataFormat: 'EPSG:4326'});
        var wgs84feature = wgs84geojson.readFeature({
            'type': 'Feature',
            'geometry': geom
        }, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        return wgs84feature;
    },

    /**
     * Sets a map marker to the provided position.
     * @param geojson should be a point
     */
    setStart: function (geojson) {
        var feature = this.transform(geojson);
        var iconBuilder = new IconBuilder({icon: "map-marker", color: "black"});
        feature.setStyle(iconBuilder.get());
        this.vectorSource.addFeature(feature);
    },

    /**
     * Places a checked flag as finish marker on the map.
     * @param geojson should be a point
     */
    setFinish: function (geojson) {
        var feature = this.transform(geojson);
        var iconBuilder = new IconBuilder({icon: "flag-checkered", color: "black"});
        feature.setStyle(iconBuilder.get());
        this.vectorSource.addFeature(feature);
    },


    /**
     * Looks up style definitions for feature types.
     * @param feature feature name
     * @param resolution
     * @return {*}
     */
    styleFunction: function (feature, resolution) {
        return mapStyles[feature.getGeometry().getType()];
    },

    /**
     * Clears the map and sets the map reference to null to allow it being garbage collected.
     */
    onDestroy: function () {
        this.map.setTarget(null);
        this.map = null;
        this.vectorSource.clear();
        console.log("view destroy");
    }


});