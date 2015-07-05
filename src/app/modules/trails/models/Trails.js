var BaseCollection = require('commons/models/BaseCollection');
var Trail = require('./Trail');

/**
 * A collection of Trail objects.
 */
module.exports = BaseCollection.extend({
	model: Trail,
	baseUrl : "/api/v1/trails/"
});