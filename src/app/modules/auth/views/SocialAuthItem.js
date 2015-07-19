var Marionette = require('backbone.marionette');
var tpl = require('../templates/socialauthItem.hbs');

/**
 * Renders a button which links to the social auth service of the oauth provider given in the model.
 */
module.exports = Marionette.ItemView.extend({
   template: tpl,

    /**
     * Maps oauth provider names to fontawesome icon names
     */
    iconMap: {
      google: "google-plus"
    },

    initialize: function(options) {
        this.mergeOptions(options, ['next']);
    },

    templateHelpers: function () {
        // using a function instead a dict here allows access to the
        // model before serialization
        return {
            'loginUri': this.model.getLoginUrl() + "?next=" + encodeURIComponent("/" + this.next),
            'provider': this.model.getProvider(),
            'iconClassStr': this.getIconClassStr()
        };
    },

    getIconClassStr: function() {
        var cl = "fa fa-";
        var provider = this.model.getProvider();
        var icon = this.iconMap[provider] || provider;
        return cl+icon;
    }
});