var ScaleBaseModel = require('./ScaleBaseModel');
var $ = require('jquery');

module.exports = ScaleBaseModel.extend({

    prefix: "#/uxc-scale/",
    urlRoot: "/api/v1/uxc-scale/",

    toString: function () {
        return "UXC Scale";
    },

    /**
     * Uses common labels from the base class and extends them with specific labels/keys.
     *
     * @return a mapping from value keys to display names which is specific to this
     * scale class.
     */
    getLabels: function () {
        return $.extend({
            max_slope_uh: "Maximum slope uphill (%)",
            total_ascent: "Total ascent (m)"
        }, this.labels);
    }


});
