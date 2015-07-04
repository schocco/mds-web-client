var Marionette = require('backbone.marionette');
var ScoreView = require('./Score');
var tpl = require('../templates/uxc.hbs');
var $ = require('jquery');

/**
 * Explanation and calculator for the UDH scale.
 */
module.exports = Marionette.LayoutView.extend({
	regions: {
		calculator: '[data-region=calculator]'
	},
	template: tpl,

    triggers: {
        "click #showInCalculator": "show:example"
    },

	onShow: function() {
        this.scoreView = new ScoreView({type: "uxc", editable: true});
		this.calculator.show(this.scoreView);
	},

    /**
     * Sets the values of the calculation example in the calculator table.
     */
    onShowExample: function(){
        //get form fields by name and set values
        $("#max_slope_uh>input").val(8);
        $("#total_ascent>input").val(590);
        $("#avg_difficulty>:input").val(0.5);
        $("#max_difficulty>:input").val(1.5);
        $("#total_length>input").val(42000);
        // simulate a click on the update button
        this.scoreView.onScoreUpdateClicked();
        $('html,body').animate({scrollTop: $("#calculateScoreForm").offset().top},'slow');
    }

});