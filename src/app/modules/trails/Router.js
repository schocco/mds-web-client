var Marionette = require('backbone.marionette');
var $ = require('jquery');
var app = require('../../App');
var Radio = require('backbone.radio');
var _ = require('lodash');

module.exports = Marionette.AppRouter.extend({
    appRoutes: {
        'trails'  : 'trailList',
        'trails/upload/': 'trailUpload',
        'trails/:id/' : 'trailDetail'
    },

    protected: ['trails/upload/'],
    sessionChannel: Radio.channel('session'),

    /**
     * Overridden to allow auth check in before method.
     * @param route
     * @param name
     * @param callback
     * @return {*}
     */
    route: function(route, name, callback) {
        var router = this;
        if (!callback) callback = this[name];

        var f = function() {
            if(_.bind(router.before, router)(route, name, callback)) {
                callback.apply(router, arguments);
            }

        };
        return Marionette.AppRouter.prototype.route.call(this, route, name, f);
    },

    /**
     * Only procede with routing if user is logged in or if the route does not require authentication.
     *
     * @param name
     * @param args
     * @return {boolean}
     */
    before: function(name, args) {
        if($.inArray(name, this.protected) !== -1) {
            var currentUser = this.sessionChannel.request("user:current");
            if(currentUser === undefined || currentUser === null || !currentUser.isAuthenticated()) {
                console.log("navigate to login view and set next parameter");
                this.navigate("#/login?next=" + name, true);
                return false;
            }
        }
        return true;
    }



});
