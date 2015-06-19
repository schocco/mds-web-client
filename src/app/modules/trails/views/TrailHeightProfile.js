var Marionette = require('backbone.marionette');
var tpl = require('../templates/trailHeightProfile.hbs');
var Chart = require('chart.js');


/**
 * Displays a chart.js based height profile (line chart) for the provided profile object.
 */
module.exports = Marionette.ItemView.extend({
    template: tpl,

    viewOptions: ['profile'],

    /**
     * @param options.profile object with height profile information from the trail object
     * @param options.profile.labels {Array} list of labels
     * @param options.profile.max_height {Number} max height in meters
     * @param options.profile.min_height {Number} min height in meters
     * @param options.profile.values {Array}
     */
    initialize: function(options) {
        this.mergeOptions(options, this.viewOptions);
    },

    onRender: function() {
        console.log("render render.");

    },

    onShow: function() {
        console.log("its not shown?");
        this.showHeightProfile();
    },

    /**
     * Draws the height profile chart in the canvas element.
     */
    showHeightProfile: function(){
        var canvasdiv = document.getElementById("heightProfileDiv");
        var canvas = document.getElementById("heightProfile");
        canvas.width = canvasdiv.clientWidth;
        canvas.height = canvasdiv.clientHeight;
        var ctx = canvas.getContext("2d");


        var data = this.getChartData(this.profile);

        // fixed scale
        var options = {
            scaleOverride : true,
            scaleSteps : 10,
            scaleStepWidth : Math.round((this.profile.max_height - this.profile.min_height + 10)) / 10,
            scaleStartValue : Math.round(10* this.profile.min_height - 5)/10,
            pointDot : false,
            scaleLabel : "<%=value%> m",
            scaleLineColor : "rgba(0,0,0,.3)",
            scaleGridLineColor : "rgba(0,0,0,.15)",
            bezierCurve : false,
            responsive: true
        };
        var heightProfileChart = new Chart(ctx).Line(data, options);
    },

    /**
     * Use the models waypoints to provide a dataset for chart.js
     */
    getChartData: function(){
        var dataset = [];
        var labels = [];

        var data = {
            labels : this.profile.labels,
            datasets : [
                {
                    fillColor : "rgba(205,92,92,0.5)",
                    strokeColor : "rgba(205,92,92,1)",
                    pointColor : "rgba(205,92,92,1)",
                    pointStrokeColor : "#fff",
                    data : this.profile.values
                }
            ]
        };
        return data;
    }

});