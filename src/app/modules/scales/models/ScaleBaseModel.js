var BaseModel = require('commons/models/BaseModel');

/**
 * Base model for the UDH and UXC models with capability to request score from api.
 */
module.exports = BaseModel.extend({
	
	/**
	 * Retrieve the score for the current values without saving the object.
	 * Triggers a "score_update" event on the model, when done.
	 */
	get_score: function(){
		var uri = this.urlRoot + "calculate/";
		result = {};
		var that = this;
		var jqxhr = $.post(uri, this.attributes,
			function(data) {
				that.set("score", data);
				console.log("Updated score for " + that);
				that.trigger("score_update");
			})
			.fail(function(data) {
				console.log("updating score for " + that + "failed");
				that.trigger("score_update", data);
				console.log(data);
			});
	}


});