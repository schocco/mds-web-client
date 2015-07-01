var Marionette = require('backbone.marionette');
var ChildView = require('./SocialAuthItem');
var tpl = require('../templates/login.hbs');
var Radio = require('backbone.radio');
/**
 * Renders login options. Login form for internal accounts and links to
 * oauth providers that are configured in django.
 */
module.exports = Marionette.CompositeView.extend({

    template: tpl,
    viewOptions: ['next'],
    childView: ChildView,
    childViewContainer: '#socialBackends',

    ui: {
        loginButton: '#loginBtn',
        usernameField: '#id_username',
        passwordField: '#id_password'
    },

    triggers: {
        'click @ui.loginButton': 'login:clicked'
    },

    sessionChannel: Radio.channel('session'),

    initialize: function (options) {
        this.mergeOptions(options, this.viewOptions);
    },

    /**
     * Get credentials from form and log in.
     */
    onLoginClicked: function () {
        var username = this.ui.usernameField.val();
        var password = this.ui.passwordField.val();
        this.sessionChannel.request('login', username, password, {error: function(reason) {
            alert(reason);
        }});

    },

    childViewOptions: {
        'next': function () {
            return this.next;
        }
    }

});