var ScaleBaseModel = require('./ScaleBaseModel');
var $ = require('jquery');

module.exports = ScaleBaseModel.extend({

    prefix: "#/udh-scale/",
    urlRoot: "/api/v1/udh-scale/",

    toString: function () {
        return "UDH Scale";
    },

    /**
     * Uses common labels from the base class and extends them with specific labels/keys.
     *
     * @return a mapping from value keys to display names which is specific to this
     * scale class.
     */
    getLabels: function () {
        return $.extend({avg_slope: "Average slope (%)"}, this.labels);
    }

});
