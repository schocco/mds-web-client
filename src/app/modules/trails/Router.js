var Marionette = require('backbone.marionette');
var $ = require('jquery');
var app = require('../../App');
var Radio = require('backbone.radio');

module.exports = Marionette.AppRouter.extend({
    appRoutes: {
        'trails'  : 'trailList',
        'trails/upload/': 'trailUpload',
        'trails/:id/' : 'trailDetail'
    },

    protected: ['trails/upload/'],
    sessionChannel: Radio.channel('session'),

    onRoute: function(name, path, args) {
        console.log("path " + path);
        if($.inArray(path, this.protected) !== -1) {
            var currentUser = this.sessionChannel.request("user:current");
            if(currentUser === undefined || currentUser === null || !currentUser.isAuthenticated()) {
                console.log("navigate to login view and set next parameter");
                this.navigate("#/login?next=" + path, true);
                return false;
            }
        }
    }



});
