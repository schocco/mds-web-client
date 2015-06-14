/**
 * Performs an equality check (==) and returns the content inside the block only if both values are identical.
 * @param val1
 * @param val2
 * @return {*}
 */
module.exports = function(val1, val2, options) {
    var result = val1 == val2;
    if(result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};