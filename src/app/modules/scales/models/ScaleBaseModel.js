var BaseModel = require('commons/models/BaseModel');
var $ = require('jquery');

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
				console.log("Updated score for " + that);
				that.trigger("update:score");
			})
			.fail(function(data) {
				console.log("updating score for " + that + "failed");
				that.trigger("update:score:failed", data);
				console.log(data);
			});
	},

	labels: {
		avg_difficulty: "Average difficulty (M-Scale)",
		max_difficulty: "Maximum difficulty (M-Scale)",
		total_length: "Total length (m)",
		total_score: "Total score"
	}


});