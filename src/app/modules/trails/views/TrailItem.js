var Marionette = require('backbone.marionette');
var tpl = require('../templates/item.hbs');

/**
 * List of available trail objects.
 */
module.exports = Marionette.ItemView.extend({
	template: tpl,

	templateHelpers: function () {
		// using a function instead a dict here allows access to the
		// model before serialization
		return {'clientUri': this.model.get_url()};
	}

});