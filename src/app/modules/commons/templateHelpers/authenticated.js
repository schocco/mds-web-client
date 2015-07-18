/**
 * Checks if the current user is authenticated.
 * Views using this templateHelper should listen for the login/logout event and rerender when user status changes.
 * @return {*}
 */
var Radio = require('backbone.radio');
var sessionChannel = Radio.channel("session");

module.exports = function(options) {
    var user = sessionChannel.request("user:current");
    if(user !== null && user !== undefined && user.isAuthenticated()) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};