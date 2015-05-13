var BaseCollection = require('../../../models/BaseCollection');
var Mscale = require('./Mscale');

/**
 * A collection of Mscale objects.
 */
module.exports = BaseCollection.extend({
	model: Mscale,
	url : "/api/v1/mscales/?format=json"
});