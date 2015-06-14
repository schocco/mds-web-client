var _ = require('lodash');
/**
 * Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.
 * @param val value to be escaped
 * @returns {string}
 */
module.exports = function(val) {
    return _.escape(val);
};