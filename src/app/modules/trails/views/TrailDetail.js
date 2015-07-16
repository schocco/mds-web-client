var Marionette = require('backbone.marionette');
var tpl = require('../templates/detail.hbs');
var ScoreView = require('scales/views/Score');
var MapView = require('map/views/MapView');
var HeightProfileView = require('./TrailHeightProfile');
var UXCModel = require('scales/models/UXCModel');
var UDHModel = require('scales/models/UDHModel');
var Radio = require('backbone.radio');

var User = require('auth/models/User');
var UserWidget = require('auth/views/UserWidget');

/**
 * Detail view for a single trail object.
 */
module.exports = Marionette.LayoutView.extend({

    regions: {
        scoring:'[data-region=scoring]',
        map: '[data-region=map]',
        heightProfile: '[data-region=heightProfile]',
        trailCreator: '#trailcreator'
    },

    /** Maps trail types to scale types.  */
    typeMap: {
        "downhill": "udh",
        "xc": "uxc"
    },
    template: tpl,

    initialize: function (options) {
        this.mergeOptions(options, ['user']);
        this.listenTo(this.model, "change", this.render);
    },

    sessionChannel: Radio.channel("session"),

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
                saveable: this.isEditable(),
                score: this.getRatingDataFromTrail()
            });
            this.scoring.show(scoringView);
        }
        // display trail creator
        if(this.model.has("owner")){
            var user = new User({resource_uri: this.model.get('owner')});
            user.fetch();
            this.trailCreator.show(new UserWidget({model: user}));
        }

        // map view
        if (this.model.has("waypoints")) {
            var mapView = new MapView();
            mapView.addFeature(this.model.get("waypoints"));
            mapView.setStart(this.model.get("start"));
            mapView.setFinish(this.model.get("finish"));
            this.map.show(mapView);
        }
        // height profile
        if (this.model.has("height_profile")) {
            var heightProfileView = new HeightProfileView({profile: this.model.get("height_profile")});
            console.log("show height profile.");
            this.heightProfile.show(heightProfileView);
        }
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

    /**
     * A trail and its associated rating are only editable when the user is the owner of the trail.
     *
     * @return {boolean} true when the user may edit the rating and the trail
     */
    isEditable: function() {
        var currentUser = this.sessionChannel.request("user:current");
        if(currentUser && currentUser.isAuthenticated()) {
            if(currentUser.url() == this.model.get("owner") || currentUser.isAdmin()) {
                return true;
            }
        }
        return false;
    },

    /**
     * Checks if the trail has been rated.
     * @return {boolean} true when the trail has not been rated yet
     */
    isUnrated: function() {
        return this.model.getRating() === null;
    }


});