module.exports = function(num) {
    if(num !== undefined) {
        var stripped = num.replace( /^\D+/g, ''); // remove leading non-digits
        return parseFloat(stripped);
    }
    return "";
};