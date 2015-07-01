var Marionette = require('backbone.marionette');
var $ = require('jquery');
var _ = require('lodash');

/**
 * Pass in the element where the message should be displayed.
 * This is a template-less view which attaches to an existing elment in the dom tree to fill
 * it with a message and set appropriate styles.
 */
module.exports = Marionette.ItemView.extend({

    /** maps message types to appropriate class strings. */
    type2class: {
        "info": "message info",
        "warning": "message warning",
        "error": "message error"
    },

    /**
     *
     * @param options display options
     * @param options.message the message to display
     * @param options.type the message type (one of info/warning/error)
     * @param options.wrapper set an html tag if the message should be wrapped in an html element like "p",
     *                  style classes will be set on the outer element, not on the wrapper element
     */
    initialize: function(options) {
        this.mergeOptions(options, ["message", "type", "wrapper"]);
    },

    /**
     * Remove the text from the element and set element to invisible.
     * Should be called when the user closes the dialogue or when the message is no longer appropriate.
     */
    close: function() {
        this.$el.html("");
        this.el.removeClass(this.type2class[this.type]);
    },

    show: function() {
        var content = this.message;
        if(this.wrapper !== undefined) {
            var template = _.template("<<%= wrapper %>><%= message %></<%= wrapper %>>");
            content = template({wrapper: this.wrapper, message: this.message});
        }
        this.$el.html(content);
        this.$el.addClass(this.type2class[this.type]);
    }


});