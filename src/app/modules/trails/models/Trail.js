var BaseModel = require('commons/models/BaseModel');

/**
 * A trail instance.
 */
module.exports = BaseModel.extend({
	
	prefix: "#/trails/",
	urlRoot: "/api/v1/trails/",

	/**
	 * @return {object} dictionary with rating information or null if none set
	 */
	getRating: function() {
		var rating = this.get("udh_rating") || this.get("uxc_rating") || null;
		if(rating !== null) {
			rating.trail = this.url();
		}
		return rating;
	},

	getShortType: function() {
		var typeShort = this.get("type");
		if(typeShort == "downhill") {
			typeShort = "DH";
		} else if(typeShort == "xc") {
			typeShort = "XC";
		}
		return typeShort;
	}

});