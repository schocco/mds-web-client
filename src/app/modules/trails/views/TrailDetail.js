var Marionette = require('backbone.marionette');
var tpl = require('../templates/item.hbs');

/**
 * List of available trail objects.
 */
module.exports = Marionette.ItemView.extend({
	template: tpl
});