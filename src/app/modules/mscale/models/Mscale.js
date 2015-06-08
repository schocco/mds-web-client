var BaseModel = require('commons/models/BaseModel');

/**
 * An Mscale model.
 */
module.exports = BaseModel.extend({
	
	prefix: "#/mscales/",
	urlRoot: "/api/v1/mscales/",
	
	/**
	 * Mscales only have descriptions for M1,M2, etc but there are also
	 * intermediate mscale steps (M1.5, M2.5, ...) which do no carry any
	 * information.
	 *
	 * @return {boolean} true, when this is an intermediate step without a description.
	 */
	isPseudo: function(){
		return this.id % 1 !== 0;
	}

});