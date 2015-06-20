var Marionette = require('backbone.marionette');
var tpl = require('../templates/login.hbs');
var $ = require('jquery');

/**
 * Table with details for a single mscale object.
 */
module.exports = Marionette.ItemView.extend({
	template: tpl
});