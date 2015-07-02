var Marionette = require('backbone.marionette');
var User = require('../models/User');
var tpl = require('../templates/userwidget.hbs');

/**
 * An html inline element showing the username and a tooltip with additional user information on hover.
 */
module.exports = Marionette.ItemView.extend({

    template: tpl,
    tagName: "span",
    showicon: true,
    templateHelpers: function () {
        // using a function instead a dict here allows access to the
        // model before serialization
        return {
            'position': this.position,
            'buttonclass': this.buttonclass,
            'showicon': this.showicon
        };
    },

    /**
     *
     * @param options.position position of the tooltip (bottom-(left|right)|top-(left|right)|left|right)
     */
    initialize: function(options) {
        this.mergeOptions(options, ['position', 'buttonclass', 'showicon']);
        if (this.position === undefined) {
            this.position = "top-right";
        }
        if(this.buttonclass === undefined) {
            this.buttonclass = "button";
        }
        this.listenTo(this.model, "change", this.render);

    }
});