var Marionette = require('backbone.marionette');
var tpl = require('../templates/collection.hbs');
var MscaleItemView = require('./Mscale');
var $ = require('jquery');

/**
 * List view that displays all available Mscales, except intermediate steps.
 */
module.exports = Marionette.CompositeView.extend({
	template: tpl,
	childView: MscaleItemView,
	childViewContainer: '#mscales',

    /**
     * don't show intermediate mscale steps
     */
    filter: function (child, index, collection) {
      return !child.isPseudo();
    }

});