var Marionette = require('backbone.marionette');
var ScoreView = require('./Score');
var tpl = require('../templates/uxc.hbs');
var $ = require('jquery');

/**
 * Explanation and calculator for the UDH scale.
 */
module.exports = Marionette.LayoutView.extend({
	regions: {
		calculator: '[data-region=calculator]'
	},
	template: tpl,
	onShow: function() {
		this.calculator.show(new ScoreView({type: "uxc", editable: true}));
	}

});