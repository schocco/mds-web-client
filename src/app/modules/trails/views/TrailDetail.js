var Marionette = require('backbone.marionette');
var tpl = require('../templates/detail.hbs');
var helpers = require('commons/templateHelpers/templateHelpers');

/**
 * List of available trail objects.
 */
module.exports = Marionette.ItemView.extend({

    template: tpl,
    templateHelpers: helpers,

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    }


});