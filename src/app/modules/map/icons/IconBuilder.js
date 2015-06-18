var ol = require('openlayers');
var Marionette = require('backbone.marionette');
var _ = require('lodash');
var fontAwesome = require("font-awesome-webpack"); // requires entry in webpack.config, see https://www.npmjs.com/package/font-awesome-webpack

module.exports = Marionette.Object.extend({

    builderOptions: ['color', 'icon'],

    /**
     *
     * @param options options for the marker
     * @param options.color colorstring that is known byopenlayers (e.g. "black", "red", "green",...)
     * @param options.icon font awesome icon name (without fa-prefix)
     */
    initialize: function (options) {
        this.mergeOptions(options, this.builderOptions);
    },

    /**
     * Maps font awesome symbol names to the fonts chars.
     * See https://fortawesome.github.io/Font-Awesome/cheatsheet/ for a complete list
     */
    icons: {
        "map-marker": {text: "\uf041"},
        "flag": {text: "\uf024", offsetX: 12} //offset so that the flag pole is at the coordinate
    },

    /**
     * Creates a new style object using the objects atributes for styling.
     * @return {ol.style.Style} a new stye object which can be assigned to a feature
     */
    get: function () {
        var textStyle = _.assign({
            text: this.icons["\uf024"],
            font: 'normal 32px FontAwesome',
            textBaseline: 'Bottom',
            fill: new ol.style.Fill({
                color: this.color
            })
        }, this.icons[this.icon]);
        return new ol.style.Style({
            text: new ol.style.Text(textStyle)
        });
    }
});