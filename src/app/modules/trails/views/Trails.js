var Marionette = require('backbone.marionette');
var tpl = require('../templates/collection.hbs');
var TrailItemView = require('./TrailItem');

/**
 * List view that displays all available Trails.
 */
module.exports = Marionette.CollectionView.extend({
	template: tpl,
	childView: TrailItemView,
	itemViewContainer: '#trails'

    //TODO: filtering

});