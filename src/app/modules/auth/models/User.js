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

    get_url: function () {
        return this.prefix + this.get('name') + "/";
    },

    isAuthenticated: function () {
        var un = this.get("username");
        return un !== "anonymous" && !_.isEmpty(un);
    }

});