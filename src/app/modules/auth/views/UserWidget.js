var Marionette = require('backbone.marionette');
var User = require('../models/User');
var tpl = require('../templates/userwidget.hbs');

/**
 * An html inline element showing the username and a tooltip with additional user information on hover.
 */
module.exports = Marionette.ItemView.extend({

    template: tpl,
    tagName: "span",

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    }
});