var BaseCollection = require('commons/models/BaseCollection');
var Mscale = require('./Mscale');
var MscaleCache = require('./MscaleCache');
var _ = require('lodash');

/**
 * A collection of Mscale objects.
 */
module.exports = BaseCollection.extend({
	model: Mscale,
	url : "/api/v1/mscales/",

    initialize: function(options) {
        this.on("sync", _.bind(function() {
            // cache data on first reset
            MscaleCache.collection = this;
        }, this));
    },

	isCached: function() {
        return MscaleCache.collection !== null;
    },

    getCached: function() {
        return MscaleCache.collection;
    }


});