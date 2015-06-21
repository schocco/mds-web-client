var Marionette = require('backbone.marionette');
var ChildView = require('./SocialAuthItem');
var tpl = require('../templates/login.hbs');
/**
 * Renders login options. Login form for internal accounts and links to
 * oauth providers that are configured in django.
 */
module.exports = Marionette.CompositeView.extend({

    template: tpl,
    viewOptions: ['next'],
    childView: ChildView,
    childViewContainer: '#socialBackends',


    initialize: function(options) {
        this.mergeOptions(options, this.viewOptions);
    },

    childViewOptions: {'next': function() {
        return this.next;
    }}

});