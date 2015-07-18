var Marionette = require('backbone.marionette');
var tpl = require('../templates/trailFilter.hbs');
var FilterModel = require('../models/TrailFilterModel');
var Radio = require('backbone.radio');

/**
 * Shows a horizontal filter/search box.
 * After filters have been applied, the collection is refetched from the server.
 */
module.exports = Marionette.ItemView.extend({

    template: tpl,
    model: new FilterModel(),

    modelEvents: {
        "change": "render"
    },

    searchTimerId: -1,

    sessionChannel: Radio.channel("session"),

    /**
     *
     * @param options.collection the collection on which filters should be applied
     */
    initialize: function(options) {
        this.sessionChannel.on("user:login:success", _.bind(this.render));
        this.sessionChannel.on("user:logout:success", _.bind(this.render));
    },

    ui: {
        "filter_xc": "#filter_xc",
        "filter_dh": "#filter_dh",
        "filter_mine": "#filter_mine",
        "sort_asc": "#sort_asc",
        "sort_dsc": "#sort_dsc",
        "sort_name": "#sort_name",
        "sort_length": "#sort_length",
        "apply": "#applyBtn",
        "reset": "#resetBtn"
    },

    triggers: {
        "click @ui.filter_xc": "filter:xc:toggle",
        "click @ui.filter_dh": "filter:dh:toggle",
        "click @ui.filter_mine": "filter:mine:toggle",
        "click @ui.sort_asc": "sort:order:toggle",
        "click @ui.sort_dsc": "sort:order:toggle",
        "click @ui.sort_name": "sort:field:toggle",
        "click @ui.sort_length": "sort:field:toggle",
        "click @ui.apply": "apply",
        "click @ui.reset": "reset"
    },

    events : {
        "keyup #searchInput" : "onSearchKeyevent"
    },

    /**
     * Sets the current value on the model without firing a change event on the model.
     * Triggers an apply with a delay of 1/2 second. If no key events are received during
     * the delay, the current search value is used to fetch the new collection.
     * Without the delay every key press would cause a request to the server.
     *
     * Immediately performs a request when enter has been pressed.
     *
     * @param e event
     */
    onSearchKeyevent: function(e) {
        this.model.set("search", e.target.value, {silent:true});
        // perform search when enter key pressed
        if(e.keyCode == 13){
            this.onApply();
            return false;
        }
        // cancel timer if another keypress occured within the delay
        clearTimeout(this.searchTimerId);
        //start a timer, if no more key events are fired within a certain delay, perform
        // a search, otherwise restart timer
        this.searchTimerId = setTimeout(_.bind(function() {
            this.onApply();
        }, this), 500);
    },

    onFilterXcToggle: function() {
        this.model.toggle("filter_xc");
        this.onApply();
    },

    onFilterDhToggle: function() {
        this.model.toggle("filter_dh");
        this.onApply();
    },

    onFilterMineToggle: function() {
        this.model.toggle("filter_mine");
        this.onApply();
    },

    onSortOrderToggle: function() {
        this.model.toggle("sort_asc");
        this.model.toggle("sort_desc");
        this.onApply();
    },

    onSortFieldToggle: function() {
        this.model.toggle("sort_name");
        this.model.toggle("sort_length");
        this.onApply();
    },

    onApply: function() {
        // clear the search timer when something else triggered an apply before the
        // timer has fired
        clearTimeout(this.searchTimerId);
        this.collection.setFiltersAndSorting(this.model);
        this.collection.fetch();
    },

    onReset: function() {
        this.model.reset();
        this.collection.clearSettings();
        this.collection.fetch();
    }

});