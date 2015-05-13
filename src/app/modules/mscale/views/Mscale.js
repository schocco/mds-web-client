var Marionette = require('backbone.marionette');
var tpl = require('../templates/item.hbs');
var collectionTpl = require('../templates/collection.hbs');

/**
 * Table with details for a single mscale object.
 */
module.exports = Marionette.ItemView.extend({
	templateHelpers: {
        slopeNum: function () {
            return this.slope.replace(/\D/g, ''); //replace non-numeric characters
        }
    },
	template: tpl
});