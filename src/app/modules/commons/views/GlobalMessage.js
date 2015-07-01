var Marionette = require('backbone.marionette');
var tpl = require('../templates/map.hbs');
var $ = require('jquery');
var Message = require('./Message');

/**
 * Pass in the element where the message should be displayed.
 * This is a template-less view which attaches to an existing elment in the dom tree to fill
 * it with a message and set appropriate styles.
 */
module.exports = Message.extend({

    template: tpl

    //TODO: use radio to listen for events, display message when event received
    //TODO: add function to hide message on click

});