var Marionette = require('backbone.marionette');
var tpl = require('../templates/item.hbs');
var collectionTpl = require('../templates/collection.hbs');
var $ = require('jquery');

/**
 * Table with details for a single mscale object.
 */
module.exports = Marionette.ItemView.extend({
	templateHelpers: {
        slopeNum: function () {
            return this.slope.replace(/\D/g, ''); //replace non-numeric characters
        }
    },
	template: tpl,

    onShow: function() {
        this.drawSlope();
    },
    /**
     * Draw a line that represents the slope into all canvases on the page.
     * Draw two additional lines to make it a triangle.
     */
    drawSlope: function () {
        var itm = $('#slope-' + this.model.id);
        var itmSize = Number(itm.width());
        var ctx = itm[0].getContext('2d');
        var slope = Number(this.model.get("slope").replace(/\D/g, ''));

        // the slope
        ctx.beginPath();
        ctx.moveTo(0, itmSize - itmSize * slope / 100);
        ctx.lineTo(itmSize, itmSize);
        ctx.stroke();

        // left, top to bottom
        ctx.beginPath();
        ctx.moveTo(0, itmSize - itmSize * slope / 100);
        ctx.lineTo(0, itmSize);
        ctx.stroke();

        // bottom left to bottom right
        ctx.beginPath();
        ctx.moveTo(0, itmSize);
        ctx.lineTo(itmSize, itmSize);
        ctx.stroke();
    }

});