var Marionette = require('backbone.marionette');
var tpl = require('../templates/collection.hbs');
var TrailItemView = require('./TrailItem');
var PagingView = require('commons/views/PagingView');
var $ = require('jquery');

/**
 * List view that displays all available Trails.
 */
module.exports = Marionette.CompositeView.extend({
	template: tpl,
	childView: TrailItemView,
	childViewContainer: '#trails',
	paginationSelector: 'div.pagination',

    /**
     * Render paginationviews in divs above and below the items.
     */
	showPagination: function() {
        var addPages = _.bind(function(num, elem) {
            console.log(elem);
            var paging = new PagingView({el: elem, collection: this.collection});
            $(elem).html();
            paging.render();
        }, this);
        $(this.paginationSelector).each(addPages);
	},

    onShow: function() {
        this.showPagination();
    }
});