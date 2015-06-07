var BaseCollection = require('commons/models/BaseCollection');
var Trail = require('./Trail');

/**
 * A collection of Trail objects.
 */
module.exports = BaseCollection.extend({
	model: Trail,
	url : "/api/v1/trails/?format=json"
});