var Marionette = require('backbone.marionette');
var tpl = require('../templates/detail.hbs');
var ScoreView = require('scales/views/Score');
var MapView = require('map/views/MapView');
var UXCModel = require('scales/models/UXCModel');
var UDHModel = require('scales/models/UDHModel');

/**
 * Detail view for a single trail object.
 */
module.exports = Marionette.LayoutView.extend({

    regions: {
        scoring:'[data-region=scoring]',
        map: '[data-region=map]'
    },

    /** Maps trail types to scale types.  */
    typeMap: {
        "downhill": "udh",
        "xc": "uxc"
    },
    template: tpl,

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    /**
     * Triggers the rendering of all subviews.
     * Wait until the view has been rendered before inserting subviews into dom nodes.
     */
    onRender: function () {
        // rating view
        if (this.model.get("type") !== undefined) {
            var scoringView = new ScoreView({
                type: this.typeMap[this.model.get("type")],
                editable: this.isEditable(),
                score: this.getRatingDataFromTrail()
            });
            this.scoring.show(scoringView);
        }
        // map view
        if (this.model.get("waypoints") !== undefined) {
            var mapView = new MapView();
            mapView.addFeature(this.model.get("waypoints"));
            mapView.setStart(this.model.get("start"));
            mapView.setFinish(this.model.get("finish"));
            this.map.show(mapView);
        }
        // height profile
        //TODO: height profile subview
    },

    /**
     * Creates a new scale model and sets attributes with values found in the trail model.
     * If the trail has already been rated, then the associated rating object is returned.
     *
     * @return {Object} created scale object as dictionary / existing trail rating
     */
    getRatingDataFromTrail: function () {
        if (this.model !== null && this.model.get("type") !== null) {
            if(this.isUnrated()) {
                var scaleModel = this.model.get("type") == "downhill" ? new UDHModel() : new UXCModel();
                scaleModel.setTrailValues(this.model);
                return scaleModel.toJSON();
            } else {
                return this.model.getRating();
            }
        }
        return {};
    },

    isEditable: function() {
        //TODO: check permissions
        return true;
    },

    isUnrated: function() {
        return this.model.getRating() === null;
    }


});