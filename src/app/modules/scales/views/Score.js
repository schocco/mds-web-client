var Marionette = require('backbone.marionette');
var tpl = require('../templates/score.hbs');
var tplUDH = require('../templates/udhTable.hbs');
var tplUXC = require('../templates/uxcTable.hbs');
var UDHModel = require('../models/UDHModel');
var UXCModel = require('../models/UXCModel');
var $ = require('jquery');
var Chart = require('chart.js');

/**
 * Scoring view for either UDH or UXC.
 * Renders the appropriate rating table in a region and draws a chart representation of the score.
 */
module.exports = Marionette.LayoutView.extend({
    profileViewOptions: ['type', 'editable', 'score'],

    regions: {
        scoringTable: '[data-region=scoringTable]'
    },

    triggers: {
        "click #updateBtn": "score:update:clicked",
        "click #saveBtn": "score:save:clicked"
    },

    modelEvents: {
        "update:score": "onScoreUpdate"
    },

    typeModelMap: {
        "udh": UDHModel,
        "uxc": UXCModel
    },

    template: tpl,

    initialize: function (options) {
        this.mergeOptions(options, this.profileViewOptions);
        this.model = this.getModel();
        Marionette.bindEntityEvents(this, this.model, this.modelEvents);
    },

    /**
     * Gets the appropriate scale model depending on the type argument provided upon instantiation.
     * @return {UDHModel | UXCModel}
     */
    getModel: function () {
        if (this.model === undefined) {
            // create model object, either empty or with scoring data from caller
            this.model = new this.typeModelMap[this.type](this.score);
        }
        return this.model;
    },

    templateHelpers: function () {
        return {
            editable: this.editable,
            type: this.type,
            name: this.model.toString()
        };
    },

    onShow: function () {
        if (this.model.get('score') !== undefined) {
            this.drawScoreChart();
        }
        this.renderTable();
    },

    /**
     * Re-renders regions when the model was updated with a new calculation result.
     */
    onScoreUpdate: function () {
        this.drawScoreChart();
        this.renderTable();
    },

    /**
     * Renders the scoring table in the appropriate region.
     */
    renderTable: function () {
        var tableView = new Marionette.ItemView({
            model: this.model,
            template: this.getTableTemplate(),
            templateHelpers: this.templateHelpers()
        });
        this.scoringTable.show(tableView);
    },

    /**
     * Called when the user clicks the update button.
     * Triggers a post request to the API to get an updated score with the current table values.
     */
    onScoreUpdateClicked: function () {
        this.readFormValues();
        this.model.getScore();
    },

    /**
     *
     */
    onScoreSaveClicked: function () {

    },


    /**
     * Reads the values from the scoring form and updates the model with the new values.
     * If the score is not editable, then no operation is performed.
     */
    readFormValues: function () {
        if (this.editable) {
            // iterate over all labels of the model and read  the
            // matching input fields from the form
            _.forEach(this.model.getLabels(), function (val, key) {
                var input = $("#" + key + "> :input");
                this.model.set(key, input.val());
            }, this);
        }
    },

    /**
     *
     * @return {String} template for the UDH or UXC table
     */
    getTableTemplate: function () {
        if (this.type == "udh") {
            return tplUDH;
        } else {
            return tplUXC;
        }
    },

    onClose: function () {
        Marionette.unbindEntityEvents(this, this.model, this.modelEvents);
    },

    /**
     * Draw a radar chart representation of the score.
     */
    drawScoreChart: function () {
        var options = {
            //scaleShowLabels : true,
            //datasetStroke : false,
            scaleLineColor: "rgba(0,0,0,.15)",
            scaleOverride: true,
            scaleStepWidth: 1,
            scaleSteps: 10,
            responsive: true,
            legendTemplate: "hello"
        };
        var score = this.model.get("score");

        //set size
        var div = document.getElementById('canvasDiv');
        var canvas = document.getElementById('chartCanvas');
        var ctx = canvas.getContext("2d");
        var datasets = [
            {
                label: "a label",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff"
            }
        ];

        var scoreData;
        var chartData;

        if (this.type == "udh") {
            // UDH
            scoreData = [score.avg_slope.result,
                score.avg_difficulty.result,
                score.max_difficulty.result,
                score.total_length.result];
            datasets[0].data = scoreData;
            chartData = {
                labels: ["Avg Slope", "Avg Difficulty", "Max Difficulty", "Length"],
                datasets: datasets
            };
        } else {
            // UXC
            scoreData = [score.avg_difficulty.result / score.avg_difficulty.max * 10,
                score.max_difficulty.result / score.max_difficulty.max * 10,
                score.max_slope_uh.result / score.max_slope_uh.max * 10,
                score.total_ascent.result / score.total_ascent.max * 10,
                score.total_length.result / score.total_length.max * 10];
            datasets[0].data = scoreData;
            chartData = {
                labels: ["Avg difficulty", "Max difficulty", "Max slope", "Total ascent", "Total length"],
                datasets: datasets
            };
        }
        new Chart(ctx).Radar(chartData, options);
    }
});