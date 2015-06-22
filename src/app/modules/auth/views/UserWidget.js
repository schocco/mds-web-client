var Marionette = require('backbone.marionette');
var User = require('../models/User');
var tpl = require('../templates/userwidget.hbs');

module.exports = Marionette.ItemView.extend({

    template: tpl,
    tagName: "span",

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },

    onRender: function() {
        console.log(this.model.get('first_name'));
    }
});