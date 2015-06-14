var Marionette = require('backbone.marionette');
var tpl = require('../templates/detail.hbs');

/**
 * List of available trail objects.
 */
module.exports = Marionette.ItemView.extend({

    template: tpl,

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    }


});