var backbone = require('backbone');
var Radio = require('backbone.radio');
var _ = require('lodash');

module.exports  = backbone.Model.extend({
   defaults: {
       filter_dh: false,
       filter_xc: false,
       filter_mine: false,
       sort_name: true,
       sort_length: false,
       sort_asc: true,
       sort_desc: false,
       search: null
   },

    /**
     * Toggles a boolean flag if the attribute exists.
     * @param field
     */
    toggle: function(field) {
        if(this.has(field)) {
            this.set(field, !this.get(field));
        } else {
            throw "no such field";
        }
    },

    /**
     * @return {{}} dictionary with filter keys and values
     */
    getFilterOptions: function() {
        var filters = {};
        if(this.get("filter_dh") && !this.get("filter_xc")) {
            filters.type = "downhill";
        }
        if(this.get("filter_xc") && !this.get("filter_dh")) {
            filters.type = "xc";
        }
        if(this.get("filter_mine")) {
            var user = Radio.channel("session").request("user:current");
            if(user.has("id")) {
                filters.owner = user.get("id");
            }
        }
        return filters;
    },

    /**
     * @return {string} field to be used for sorting
     */
    getSorting: function() {
        var sorting;
        if(this.get("sort_name")) {
            return "name";
        } else {
            return "length";
        }
    },

    /**
     * @return {string} + when ascending, - when descending
     */
    getSortOrder: function() {
        if(this.get("sort_asc")) {
            return "+";
        } else {
            return "-";
        }
    },

    /**
     * Sets the default attributes on
     * the model, overwriting all current settings.
     */
    reset: function() {
        this.set(this.defaults);
    }
});