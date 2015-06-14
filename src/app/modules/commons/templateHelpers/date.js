var _ = require('lodash');

var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

/**
 * Turns a timestamp into a string in the format of d M yyyy (e.g. "7 August 2016")
 * @param date date or string that can be recognized as date
 * @returns {string}
 */
module.exports = function(date) {
    var d = new Date(date);
    return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
};