var Marionette = require('backbone.marionette');
var ChildView = require('./SocialAuthItem');
var tpl = require('../templates/login.hbs');
var Radio = require('backbone.radio');
var Message = require('commons/views/Message');
/**
 * Renders login options. Login form for internal accounts and links to
 * oauth providers that are configured in django.
 */
module.exports = Marionette.CompositeView.extend({

    template: tpl,
    viewOptions: ['next'],
    childView: ChildView,
    childViewContainer: '#socialBackends',
    childViewOptions: function() {
        return {
            next: encodeURIComponent(this.next)
        };
    },

    ui: {
        loginButton: '#loginBtn',
        usernameField: '#id_username',
        passwordField: '#id_password'
    },

    triggers: {
        'click @ui.loginButton': 'login:clicked'
    },

    events:{
        'keydown #loginForm': 'onFormKeydown'
    },

    sessionChannel: Radio.channel('session'),
    notificationChannel: Radio.channel('notification'),

    /**
     *
     * @param options.next name of the view to visit after login (a hash will be prepended if it is not present)
     */
    initialize: function (options) {
        this.mergeOptions(options, this.viewOptions);
        if(this.next && this.next.indexOf("#") !== 0) {
            this.next = "#" + this.next;
        }
        if(this.next === undefined) {
            this.next = "#profile/me";
        }
        this.sessionChannel.on("user:login:success", _.bind(this.render));
        this.sessionChannel.on("user:logout:success", _.bind(this.render));
    },

    /**
     * Treat enter key as form submission.
     * @param event
     */
    onFormKeydown: function(event) {
      if(event.which == 13 || event.keyCode == 13){
          this.onLoginClicked();
          event.preventDefault();
      }
    },

    /**
     * Get credentials from form and log in.
     */
    onLoginClicked: function () {
        var username = this.ui.usernameField.val();
        var password = this.ui.passwordField.val();
        this.sessionChannel.request('login', username, password, {
            error: this.onLoginError,
            success: this.onLoginSuccess,
            context: this
        });
    },

    /** show login error message above the form. */
    onLoginError: function(response) {
        var msg = new Message({el: "#formMessage", type:"error",wrapper:"p",message:"Login failed: " + response.reason});
        msg.show();
    },

    /** show global success message and redirect to next view if a redirect is specified. */
    onLoginSuccess: function() {
        var msg = new Message({el: "#formMessage", type:"info",wrapper:"p",message:"You are now logged in."});
        msg.show();
        if(this.next !== undefined) {
            this.navigate(this.next);
        }
    }

});