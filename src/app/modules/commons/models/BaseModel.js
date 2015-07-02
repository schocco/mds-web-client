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
     *
     * Uses the tastypie resource_uri if it is set on the model attributes.
     * This allows fetching objects by url: new Model({resource_uri:"/api/v1/models/1/"}).fetch()
	 */
	url : function() {
        if(this.get('resource_uri') !== undefined) {
            return this.get('resource_uri'); // use the tastypie resource_uri if it is set
        }
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
