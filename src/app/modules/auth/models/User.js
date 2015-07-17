var BaseModel = require('commons/models/BaseModel');
var _ = require('lodash');
var $ = require('jquery');

/**
 * A site user.
 */
module.exports = BaseModel.extend({
    prefix: "",
    urlRoot: "/api/v1/users/",
    defaults: {
        username: "anonymous"
    },

    getClientUri: function () {
        return this.prefix + this.get('name') + "/";
    },

    isAuthenticated: function () {
        var un = this.get("username");
        return !(_.isEmpty(un) || un == "anonymous");
    },

    /**
     * See https://docs.djangoproject.com/en/1.8/ref/contrib/auth/#django.contrib.auth.models.User.is_staff
     * @return {*|boolean}
     */
    isStaff: function() {
        return this.get("is_staff") || false;
    },

    /**
     * See https://docs.djangoproject.com/en/1.8/ref/contrib/auth/#django.contrib.auth.models.User.is_superuser
     * @return {*|boolean}
     */
    isAdmin: function () {
        return this.get("is_admin") || false;
    }

});