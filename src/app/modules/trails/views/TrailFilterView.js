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
        this.collection.setFiltersAndSorting(this.model);
        this.collection.fetch();
    },

    onReset: function() {
        this.model.reset();
        this.collection.clearSettings();
        this.collection.fetch();
    }

});