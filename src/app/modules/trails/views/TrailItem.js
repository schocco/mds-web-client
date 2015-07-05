var Marionette = require('backbone.marionette');
var tpl = require('../templates/item.hbs');

/**
 * Item view to be rendered in the list of trails.
 */
module.exports = Marionette.ItemView.extend({
	template: tpl,

	templateHelpers: function () {
		// using a function instead a dict here allows access to the
		// model before serialization
		return {
			clientUri: this.model.get_url(),
            typeShort: this.model.getShortType(),
            totalScore: this.getScore()
		};
	},

    getScore: function() {
        if(this.model.get("uxc_rating")) {
            return this.model.get("uxc_rating").score.total_score;
        } else if(this.model.get("udh_rating")) {
            return  this.model.get("udh_rating").score.total_score;
        } else {
            return "?";
        }
    }

});