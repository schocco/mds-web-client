/**
 * A collection of helpers that are not module specific, but might be needed in several places.
 */
    var _ = require('lodash');

var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

var helpers = {
    /**
     * Rounds to the nearest integer.
     * @param value must be a number
     * @returns {number}
     */
    'round': function(value) {
        return Math.round(value);
    },

    /**
     * Turns a timestamp into a string in the format of d M yyyy (e.g. "7 August 2016")
     * @param date date or string that can be recognized as date
     * @returns {string}
     */
    'date': function(date) {
        var d = new Date(date);
        return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
    },

    /**
     * Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.
     * @param val value to be escaped
     * @returns {string}
     */
    'escape': function(val) {
        return _.escape(val);
    }
};

module.exports = helpers;