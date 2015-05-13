var Backbone = require('backbone');

module.exports = Backbone.Model.extend({

	/**
	 * A prefix which is used in the client application uris.
	 */
	prefix : "#/",

	/**
	 * Returns the relative URL where the model's resource would be
	 * located on the server. Overridden to ensure trailing slash after
	 * url.
	 */
	url : function() {
		var origUrl = Backbone.Model.prototype.url.call(this);
		return origUrl	+ (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
	},

	/**
	 * The uri used in the client views. Defaults to prefix + model.id
	 */
	get_url : function() {
		return this.prefix + this.get('id') + "/";
	}

});
