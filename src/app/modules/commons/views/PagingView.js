var Marionette = require("backbone.marionette");
var tpl = require('../templates/paging.hbs');
var $ = require('jquery');

module.exports = Marionette.ItemView.extend({

    template: tpl,

    collectionEvents: {
        "sync": "onCollectionSync"
    },

    range: function(num) {
        var array = [];
        for (var i = 0; i < num; i++) {
            array[i] = i+1;
        }
        return array;
    },

    onCollectionSync: function() {
        this.render();
    },

    /**
     *
     * @return {{hasPages: boolean, pages: *, currentPage: *, hasPrevious: *, hasNext: *}}
     */
    serializeData: function(){
        return {
            hasPages: this.collection.getTotalPages() > 1,
            pages: this.range(this.collection.getTotalPages()),
            currentPage: this.collection.currentPageNumber(),
            hasPrevious: this.collection.hasPreviousPage(),
            hasNext: this.collection.hasNextPage()
        };
    },

    onRender: function() {
        _.bindAll(this, "loadPage", "loadNextPage", "loadPrevPage");
        $('.pageLink').click(this.loadPage);
        $('.nextPage').click(this.loadNextPage);
        $('.prevPage').click(this.loadPrevPage);
    },

    /**
     * triggers pageload of next page
     * @param e
     */
    loadNextPage: function(e){
        e.preventDefault();
        this.collection.getNextPage();
    },

    /**
     * triggers pageload of previous page
     * @param e
     */
    loadPrevPage: function(e){
        e.preventDefault();
        this.collection.getPreviousPage();
    },

    /**
     * triggers pageload of page that corresponds to the clicked number
     * @param e
     */
    loadPage: function(e){
        e.preventDefault();
        var page = parseInt($(e.target).attr("href").substring(1));
        this.collection.getPage(page);
    }
});