var Marionette = require('backbone.marionette');
var User = require('./User');
var $ = require('jquery');
var Radio = require('backbone.radio');
var _ = require('lodash');

/**
 * A session management object which relies on the User model.
 *
 * Contains methods related to the current user and session.
 *
 * Triggers events using a backbone.radio channel when changes occur, so that
 * other modules can react appropriately by e.g. displaying or hiding  content that is only available to
 * authenticated users.
 *
 * There should only be one instance of this class, which should only be accessed through module.js or backbone.radio.
 *
 * -------------------------   ---------------------------------------------
 * Announcements               Parameters
 * -------------------------   ---------------------------------------------
 * user:login:success          user - the User model
 * user:login:error            data - ajax response data
 * user:logout:success         user - the current user model
 * user:logout:error           data - ajax response data
 *
 * ----------------  ----------------------------------------- -----------
 * Request           Request params (in)                        reply
 * ----------------  ----------------------------------------- -----------
 * login             username
 *                   password
 *                   options.success (called with user model)
 *                   options.error (called with xhr data)
 * logout
 * user:current                                                user model
 *
 *
 *
 * @type {Marionette.object} Session instance
 */
module.exports = Marionette.Object.extend({

        sessionOptions: ['a'],
        /** api endpoint for session related checks */
        urlRoot: "/api/v1/users/",
        /** The currently logged in user or an anonymous default user. */
        currentUser: null,
        /** Interval in ms for checking the current session status. */
        interval: 500,
        /** max failed retries, before session checking is aborted. */
        maxRetries: 10,

        sessionChannel: Radio.channel('session'),


        initialize: function(options) {
            console.log('init session mgr');
            this.mergeOptions(options, this.sessionOptions);
            this.currentUser = this.getDefaultUser();

            this.sessionChannel.reply('login', this.login, this);
            this.sessionChannel.reply('logout', this.logout, this);
            this.sessionChannel.reply('user:current', this.currentUser);
        },

        /**
         * Runs initial checks for existing sessions, cookies etc. and sends messages via the radio.
         */
        start: function() {
            this.checkAuthStatus({
                loggedIn: function(user) {
                    this.onLoginSuccess(user);
                    console.log("already logged in");
                },
                loggedOut: function() {
                    // send logout event in case some views still think user is logged in
                    this.onLogoutSuccess();
                    console.log("logged out");
                },
                error: function(data) {
                    console.error("could not determine user session status " + data);
                }
            }, this);
        },

        /**
         * Ends all polling and dereferences resources without destroying this instance.
         */
        stop: function() {
            //TODO. implement
        },

        /**
         *
         * @return {*|exports|module.exports} default anonymous user
         */
        getDefaultUser: function() {
            return new User(); //anonymous user
        },


        /** Terminates the session. */
        logout: function () {
            var uri = this.urlRoot + "logout/";
            var that = this;
            $.post(uri).done(
                function (data) {
                    that.onLogoutSuccess(data);
                    console.log("logged out");
                })
                .fail(function (data) {
                    that.onLogoutError(data);
                    console.log("logout error");
                });
        },


        /** Authenticates the user.
         * @param username the username
         * @param password the password
         * @param options
         * @param options.success (callback function)
         * @param options.error (callback function)
         * @param options.context context for the callback method (what `this` refers to)
         * */
        login: function (username, password, options) {
            var uri = this.urlRoot + "login/";
            var that = this;
            var loginData = {username: username, password: password};
            var callbackContext = options.context === undefined ? this : options.context;
            $.ajax(uri, {
                data: JSON.stringify(loginData),
                type: "POST",
                contentType: "application/json; charset=utf-8"
            })
                .done(function (data) {
                    var user = new User(JSON.parse(data.user));
                    that.currentUser = user;
                    that.onLoginSuccess(user);
                    if (options.success) {
                        _.bind(options.success, callbackContext)(data.responseJSON);
                    }
                })
                .fail(function (data) {
                    that.onLoginError(data);
                    if (options.error) {
                        _.bind(options.error, callbackContext)(data.responseJSON);
                    }
                });
        },

        /**
         * Announce logged in user via channel and start session monitoring.
         * @param user the user returned by the api/new current user
         */
        onLoginSuccess: function(user) {
            console.log(user);
            this.currentUser = user;
            this.sessionChannel.reply('user:current', this.currentUser); //XXX: needed, as it doesn't seem to be possible to evaluate methods on each request
            this.sessionChannel.trigger("user:login:success", user);
        },

        /**
         * Announce that a login attempt has failed
         * @param user
         */
        onLoginError: function(data) {
            this.sessionChannel.trigger("user:login:error", data);
        },

        /**
         * Announce that a the current user has logged out and stop the session monitor.
         */
        onLogoutSuccess: function(data) {
            this.currentUser = this.getDefaultUser();
            this.sessionChannel.reply('user:current', this.currentUser); //XXX: needed, as it doesn't seem to be possible to evaluate methods on each request
            this.sessionChannel.trigger("user:logout:success", data);
        },

        /**
         * Announce that the logout attempt has failed.
         */
        onLogoutError: function(data) {
            this.sessionChannel.trigger("user:logout:error", data);
        },

        /**
         * Checks if the currentUser is logged in by sending a request to the server.
         * If no sessionid cookie is sent or the session has expired, the user is not logged in.
         *
         * @param options.loggedIn   a function that is called when the user is logged in, the method is invoked with
         *                           the user instance of the currently logged in user as argument
         * @param options.loggedOut  a function that is called when the user is logged out
         * @param options.error      a function that is called when an error occurs
         * @param callbackThis       what this references to in the provided callbacks (defaults to the user model
         *                           instance)
         * */
        checkAuthStatus: function (options, callbackThis) {
            var uri = this.urlRoot + "auth-status/";
            var context = callbackThis === undefined ? this : callbackThis;

            $.getJSON(uri).done(
                function (data) {
                    if (data.status == "loggedin") {
                        if (options && options.loggedIn) {
                            var user = new User(data.user);
                            _.bind(options.loggedIn, context)(user);
                        }
                    } else {
                        if (options && options.loggedOut) {
                            _.bind(options.loggedOut, context)(data);
                        }
                    }
                })
                .fail(function (data) {
                    if (options && options.error) {
                        _.bind(options.error, context)(data);
                    }
                });
        },

        /** number of errors that occurred checking the session. */
        errorCount: 0,

        /**
         * Periodically checks if the users session has expired.
         * Repeatedly check the current session.
         * Stop checking when the user logs out or
         * when the session is invalid.
         */
        doSessionCheck: function () {
            var that = this;
            var maxRetries = this.maxRetries;

            var loggedInHandler = function () {
                // session valid, keep checking
                setTimeout(this.doSessionCheck, this.interval);
            };
            var loggedOutHandler = function () {
                // change current user to default (anonymous)
                var anonymous = this.getDefaultUser();
                this.currentUser = anonymous;
                // no more checking until logged in again
            };
            var errorHandler = function () {
                // increase error count
                // keep checking unless too many errors
                that.errorCount++;
                if (that.errorCount < maxRetries) {
                    setTimeout(that.doSessionCheck, this.interval);
                } else {
                    that.loggedOutHandler();
                    that.errorCount = 0;
                }
            };

            // only need to check when the session seems to be valid,
            // anything else is handled by events
            if (this.currentUser.isAuthenticated()) {
                User.checkAuthStatus({
                    loggedIn: loggedInHandler,
                    loggedOut: loggedOutHandler,
                    error: errorHandler
                });
            }

        }
    }
);