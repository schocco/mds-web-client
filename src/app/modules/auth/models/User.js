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
    },

    /**
     * Checks if the currentUser is logged in by sending a request to the server.
     * If no sessionid cookie is sent or the session has expired, the user is not logged in.
     *
     * @param options.loggedIn      a function that is called when the user is logged in
     * @param options.loggedOut     a function that is called when the user is logged out
     * @param options.error         a function that is called when an error occurs
     * */
    checkAuthStatus: function (options) {
        //var urlRoot = "/api/v1/user/"
        var uri = this.urlRoot + "auth-status/";
        var that = this;
        var jqxhr = $.get(uri, {},
            function (data) {
                if (data.status == "loggedin") {
                    if (options.loggedIn) {
                        options.loggedIn(data);
                    }
                } else {
                    if (options.loggedOut) {
                        options.loggedOut(data);
                    }
                }
            })
            .fail(function (data) {
                if (options.error) {
                    options.error(data);
                }
            });
        return this;
    }


});