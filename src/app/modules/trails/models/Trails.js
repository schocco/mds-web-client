var BaseCollection = require('commons/models/BaseCollection');
var Trail = require('./Trail');
var TrailFilterModel = require('./TrailFilterModel');

/**
 * A collection of Trail objects.
 */
module.exports = BaseCollection.extend({
	model: Trail,
	baseUrl : "/api/v1/trails/",


	setFiltersAndSorting: function(filterModel) {
        if(filterModel instanceof TrailFilterModel) {
            this.setFilterOptions(filterModel.getFilterOptions());
            this.setSorting(filterModel.getSorting());
            this.setSortOrder(filterModel.getSortOrder());
        } else {
            throw "Paramater must be an instance of TrailFilterModel";
        }
	}
});