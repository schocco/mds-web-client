var Backbone = require('backbone');
var _ = require('lodash');
var $ = require('jquery');

/**
 * A django-tatsypie specific base collection class which parses response
 * meta data and allows pagination.
 */
module.exports = Backbone.Collection.extend({
	/**
	 * Collection META that has been returned by the last query to the
	 * API.
	 */
	recentMeta : {
		"limit" : null,
		"next" : null,
		"offset" : null,
		"previous" : null,
		"total_count" : null
	},

	settings : {
		"offset" : 0,
		"limit" : 20
	},


	/**
	 * Set the META returned by the API and return the resources.
	 * @param response
	 * @returns {*}
	 */
	parse : function(response) {
		this.recentMeta = response.meta || {};
		return response.objects || response;
	},

	url : function() {
		var urlparams = {
				offset : this.settings.offset || 0,
				limit : this.getPageSize()
		};
		urlparams = $.extend(urlparams, this.settings.filterOptions);
		if (this.settings.sortBy) {
			urlparams = $.extend(urlparams, {
				sort_by : this.settings.sortingOrder + this.settings.sortBy
			});
		}
		return this.baseUrl + '?' + $.param(urlparams);
	},

	hasNextPage : function() {
		return this.recentMeta.next !== null;
	},

	hasPreviousPage : function() {
		return this.recentMeta.previous !== null;
	},

	/**
	 *
	 * @param num the page number (starts with 1)
	 * @returns {*}
	 */
	getPage : function(num) {
		if (_.isNumber(num) && this.getTotalPages() >= num && num > 0) {
			this.settings.offset = (num - 1) * this.getPageSize();
		}
		return this.fetch({
			reset : true
		});
	},

	getFirstPage : function() {
		this.getPage(1);
	},

	getLastPage : function() {
		this.getPage(this.getTotalPages());
	},

	getNextPage : function() {
		if (this.hasNextPage()) {
			var nxt = this.urlToDict(this.recentMeta.next);
			this.settings.offset = nxt.offset;
			this.fetch({
				reset : true
			});
		}
	},

	getPreviousPage : function() {
		if (this.hasPreviousPage()) {
			var prev = this.urlToDict(this.recentMeta.previous);
			this.settings.offset = prev.offset;
			this.fetch({
				reset : true
			});
		}
	},

	/**
	 * Calculates the number of pages based on the pagesize.
	 * @returns {number} number of pages
	 */
	getTotalPages : function() {
		return Math.ceil(this.recentMeta.total_count / this.recentMeta.limit);
	},

	/**
	 *
	 * @returns {number} number of items available on the server
	 */
	getTotalItems : function() {
		return this.recentMeta.total_count;
	},

	/**
	 * Provide filter options as a dictionary. {"name" : "abc"} becomes
	 * &name=abc.
     * Searches on text fields can be performed by adding a specific comparator to the key.
     * E.g. {"name__icontains": "a"} performs a case insensitive search for all objects containing the char a in the name.
     *
     * This resets the offset to 0 as previously set offsets might be out of range after filtering.
	 *
     * @param filter
	 * @returns {object}
	 */
	setFilterOptions : function(filter) {
        // reset the offset to 0, as filtering might reduce the number of pages
        this.settings.offset = 0;
		this.settings.filterOptions = filter;
		return this;
	},

	/**
	 * Sets the field that should be used for sorting.
	 */
	setSorting : function(sorting) {
		this.settings.sortBy = sorting;
		return this;
	},

	/**
	 * Sets the order for the sorting. Can be either "+" (ascending) or
	 * "-" (descending)
	 */
	setSortOrder : function(order) {
		if (order == "+" || order == "-" || order === "") {
			// + is the default ordering, represented by empty str
			this.settings.sortingOrder = order.replace("+", "");
			return this;
		} else {
			throw "illegalArgument: must be '+' or '-'";
		}

	},

    /**
     * @param size number of elements to be on one page
     * @returns {exports}
     */
	setPageSize : function(size) {
		if (_.isNumber(size) && size > 0) {
			this.settings.limit = size;
			return this;
		} else {
			throw "illegalArgument: argument must be a positive integer";
		}
	},

	getPageSize : function() {
		return this.settings.limit || this.recentMeta.limit;
	},

	currentPageNumber : function() {
		return Math.floor(this.recentMeta.offset / this.getPageSize()) + 1;
	},

	/**
	 * Transforms query params to dict
     * @param uri parses the query part of the uri and turns it into a dictionary
     * @return {object} dictionary with extracted key-value pairs
	 */
	urlToDict : function(uri) {
		var queryParams = uri.substr(uri.lastIndexOf("?") + 1);
		return JSON.parse('{"'	+ queryParams.replace(/&/g, '","').replace(/=/g, '":"')	+ '"}');
	},

	clearSettings : function() {
		this.settings = {};
		return this;
	}

});
