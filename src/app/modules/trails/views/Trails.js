var Marionette = require('backbone.marionette');
var tpl = require('../templates/trails.hbs');
var TrailItemView = require('./TrailItem');
var PagingView = require('commons/views/PagingView');
var $ = require('jquery');
var FilterView = require('./TrailFilterView');

/**
 * List view that displays all available Trails.
 */
module.exports = Marionette.LayoutView.extend({
	template: tpl,
	paginationSelector: 'div.pagination',

    regions: {
        "trails": "#trails",
        "filter": "#filter"
    },

    /**
     * Render paginationviews in divs above and below the items.
     */
	showPagination: function() {
        var addPages = _.bind(function(num, elem) {
            var paging = new PagingView({el: elem, collection: this.collection});
            $(elem).html();
            paging.render();
        }, this);
        $(this.paginationSelector).each(addPages);
	},

    onShow: function() {
        this.showPagination();
        this.trails.show(new Marionette.CollectionView({
            childView: TrailItemView,
            collection: this.collection,
            collectionEvents: {"sync": "render"}
        }));
        this.filter.show(new FilterView({
            collection: this.collection
        }));
    }
});