var Marionette = require('backbone.marionette');
var User = require('./User');
var $ = require('jquery');
var Radio = require('backbone.radio');

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

        initialize: function(options) {
            console.log('init session mgr');
            this.mergeOptions(options, this.sessionOptions);
            this.currentUser = this.getDefaultUser();
        },



        /**
         * Runs initial checks for existing sessions, cookies etc.
         */
        start: function() {
            this.checkAuthStatus({
                loggedIn: function(user) {
                    //TODO: trigger event
                    console.log("logged in");
                    this.currentUser = user;
                },
                loggedOut: function() {
                    //TODO: trigger event
                    console.log("logged out");
                },
                error: function(data) {
                    //TODO: log error, trigger event?
                    console.log("error " + data);
                }
            }, this);
        },

        /**
         * Ends all polling and dereferences resources without destroying this instance.
         */
        stop: function() {
            //TODO. implement
        },

        getDefaultUser: function() {
            return new User(); //anonymous user
        },


        /** Terminates the session. */
        logout: function () {
            var uri = this.urlRoot + "logout/";
            $.getJSON(uri).done(
                function (data) {
                    //TODO: announce login via radio
                })
                .fail(function (data) {
                    //TODO: announce logout failed via radio
                    console.log("logout error");
                    console.log(data);
                });
        },


        /** Authenticates the user.
         * @param username the username
         * @param password the password
         * @param options
         * @param options.success (callback function)
         * @param options.error (callback function)
         * */
        login: function (username, password, options) {
            var uri = this.urlRoot + "login/";
            var that = this;
            var loginData = {username: username, password: password};
            $.ajax(uri, {
                data: JSON.stringify(loginData),
                type: "POST",
                contentType: "application/json; charset=utf-8"
            })
                .done(function (data) {
                    var user = new User(JSON.parse(data.user));
                    that.currentUser = user; //TODO: announce user via radio
                    that.events.trigger("user_login");
                    if (options.success) {
                        options.success(data.responseJSON);
                    }
                })
                .fail(function (data) {
                    //TODO: announce login failed via radio
                    if (options.error) {
                        options.error(data.responseJSON);
                    }
                });
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
                        if (options.loggedIn) {
                            var user = new User(data.user);
                            _.bind(options.loggedIn, context)(user);
                        }
                    } else {
                        if (options.loggedOut) {
                            _.bind(options.loggedOut, context)(data);
                        }
                    }
                })
                .fail(function (data) {
                    if (options.error) {
                        _.bind(options.error, context)(data);
                    }
                });
        },

        /** number of errors that occurred checking the session. */
        errorCount: 0,

        /**
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

        },

        /**
         * Periodically checks if the users session has expired.
         * Also listen for login and logout events to update the current user accordingly.
         * Trigger an event when the currentUser has changed so that views depending on the current user can
         * react to the change.
         * Display a message to the user that the session has expired.
         * Load interval for session checks from module config.
         */
        startMonitoring: function () {
            // set up event listeners
            User.events.on("user_login", doSessionCheck, this);
            User.events.on("user_logout", function () {
                var anonymous = new User();
                this.currentUser = anonymous;
            }, this);
            // only start if user is logged in
            // otherwise just listen for login event and start monitoring after login occured
            if (User.currentUser.isAuthenticated) {
                this.doSessionCheck();
            }
        }
    }
);