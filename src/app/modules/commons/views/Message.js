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
     * @param options.timeout set a timeout in ms if the message should automatically disappear.
     *                          Timeouts smaller than 500ms will be ignored.
     */
    initialize: function(options) {
        this.mergeOptions(options, ["message", "type", "wrapper", "timeout"]);
    },

    /**
     * Remove the text and message classes from the element.
     * Should be called when the user closes the dialogue or when the message is no longer appropriate.
     */
    close: function() {
        var removeClasses = _.bind(this.removeClasses, this);
        this.$el.fadeOut(300, function(){
            $(this).html("");
            removeClasses();
        });
    },

    /**
     * Removes message specific classes from element, but keeps all others.
     */
    removeClasses: function() {
        _.each(this.type2class, function(val) {
            this.$el.removeClass(val);
        }, this);
    },

    /**
     * Injects the message into the views element and sets up an event listener so that the message can be closed
     * when the user clicks the close icon.
     * If a timeout attribute is set, then the message will be auto-closed after the timeout.
     */
    show: function() {
        var content = this.message;
        if(this.wrapper !== undefined) {
            var template = _.template('<<%= wrapper %>><%= message %><a href="" class="right" style="margin-left:1rem;"><i class="fa fa-close" id="closemsg"></i></a></<%= wrapper %>>');
            content = template({wrapper: this.wrapper, message: this.message});
        }
        this.removeClasses();
        this.$el.hide();
        this.$el.html(content).fadeIn(300);
        this.$el.addClass(this.type2class[this.type]);
        var context = this;
        $('#closemsg').click(function(e) {
            e.preventDefault();
            context.close();
        });
        if(this.timeout !== undefined && this.timeout > 500) {
            var close = _.bind(this.close, this);
            setTimeout(close, this.timeout);
        }
    }


});