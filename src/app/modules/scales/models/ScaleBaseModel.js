var BaseModel = require('commons/models/BaseModel');
var $ = require('jquery');
var _ = require('lodash');
var TrailModel = require('trails/models/Trail');

/**
 * Base model for the UDH and UXC models with capability to request score from api.
 */
module.exports = BaseModel.extend({
	
	/**
	 * Retrieve the score for the current values without saving the object.
	 * Triggers a "update:score" event on the model, when done or an "update:score:failed" when something went wrong.
	 */
	getScore: function(){
		var uri = this.urlRoot + "calculate/";
		var result = {};
		var that = this;
		var jqxhr = $.post(uri, this.attributes,
			function(data) {
				that.set("score", data);
				that.trigger("update:score");
			})
			.fail(function(data) {
				console.error("updating score for " + that + "failed");
				that.trigger("update:score:failed", data);
			});
	},

	labels: {
		avg_difficulty: "Average difficulty (M-Scale)",
		max_difficulty: "Maximum difficulty (M-Scale)",
		total_length: "Total length (m)",
		total_score: "Total score"
	},

    /**
     * Maps attribute names of the scale model to attribute names of the trail model.
     * Should be extended by children with scale specific field names.
     */
    trailFields: {
        'total_length': 'trail_length'
    },

    /**
     * Sets scale attributes using corresponding values of the supplied trail object.
     *
     * @param trail a Trail model instance
     */
    setTrailValues: function(trail) {
        if(trail instanceof TrailModel) {
			this.set("trail", trail.url());
            _.forEach(this.trailFields, function(trailField,scaleField){
                this.set(scaleField, trail.get(trailField));
            }, this);
        } else {
            throw "argument must be a trail object";
        }
    }


});