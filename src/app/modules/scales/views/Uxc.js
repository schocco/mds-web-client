var Marionette = require('backbone.marionette');
var tpl = require('../templates/uxc.hbs');
var $ = require('jquery');

/**
 * Explanation and calculator for the UDH scale.
 */
module.exports = Marionette.ItemView.extend({
	template: tpl

});