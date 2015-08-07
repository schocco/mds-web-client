var BaseModel = require('commons/models/BaseModel');

var providerMap = {
    "google-oauth2": "google",
    "vk-oauth2": "vk"
};

/**
 * A social auth backend for registration/login.
 */
module.exports = BaseModel.extend({

    prefix: "#/login",
    urlRoot: "/api/v1/socialauth_backends/",

    /**
     * Gets the backend provider name.
     * @return {string} the django/social-auth specific name of the backend or the provider name if a mapping exists.
     */
    getProvider: function() {
        return providerMap[this.get('name')] || this.get('name');
    },

    /**
     * Gets the login uri, when the user clicks this uri the oauth flow starts.
     * @param next location for the redirect after successful login
     * @return {string} relative url to trigger an oauth login
     */
    getLoginUrl: function(next) {
        var nextParam = "";
        if(next !== null && next !== undefined) {
            nextParam = "/?next=" + next;
        }
        return "/login/" + this.get('name') + nextParam;
    }

});