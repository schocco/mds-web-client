/**
 * Rounds to the nearest integer.
 * @param value must be a number
 * @param precision digits behind the floating point
 * @returns {number}
 */
module.exports = function(value, precision, data) {
    if(data === undefined || precision < 0) {
        // handlebars passes a context object into each funtion as the last argument,
        // when the data argument is undefined, then no precision was specified in the template
        precision = 0;
    }
    var div = Math.pow(10, precision);
    return Math.round(value * div) / div;
};