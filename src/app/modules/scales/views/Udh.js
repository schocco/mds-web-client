var Marionette = require('backbone.marionette');
var ScoreView = require('./Score');
var tpl = require('../templates/udh.hbs');
var $ = require('jquery');

/**
 * Explanation and calculator for the UDH scale.
 */
module.exports = Marionette.LayoutView.extend({

	regions: {
		calculator: '[data-region=calculator]'
	},

    triggers: {
        "click #showInCalculator": "show:example"
    },

	template: tpl,

    onShow: function() {
        this.scoreView = new ScoreView({type: "udh", editable: true});
        this.calculator.show(this.scoreView);
    },

    /**
     * Show the example calculation in the calculation view.
     */
    onShowExample: function() {
        //get form fields by name and set values
        $("#avg_slope>input").val(16);
        $("#avg_difficulty>select").val(1.5);
        $("#max_difficulty>select").val(3.5);
        $("#total_length>input").val(6000);
        // simulate a click on the update button
        this.scoreView.onScoreUpdateClicked();
        $('html,body').animate({scrollTop: $("#calculateScoreForm").offset().top},'slow');
    }


});