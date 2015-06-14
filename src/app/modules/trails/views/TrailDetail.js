var Marionette = require('backbone.marionette');
var tpl = require('../templates/detail.hbs');
var ScoreView = require('scales/views/Score.js');
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
    onRender: function() {
        if(this.model.get("type") != undefined) {
            this.scoring.show(new ScoreView({
                type: this.typeMap[this.model.get("type")],
                editable: this.isEditable() || this.isUnrated(), //TODO: should be &&
                score: this.getRatingDataFromTrail()
            }));
        };
    },

    /**
     * Creates a new scale model and sets attributes with values found in the trail model.
     * @return {Object} created scale object as dictionary
     */
    getRatingDataFromTrail: function () {
        if (this.model != null && this.model.get("type") != null) {
            var scaleModel = this.model.get("type") == "downhill" ? new UDHModel() : new UXCModel();
            scaleModel.setTrailValues(this.model);
        }
        return scaleModel.toJSON();
    },

    isEditable: function() {
        //TODO: check permissions
        return true;
    },

    isUnrated: function() {
        return this.model.getRating() == null;
    }


});