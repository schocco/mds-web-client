var BaseCollection = require('commons/models/BaseCollection');
var SocialAuthBackend = require('./SocialAuthBackend');

/**
 * A collection of SocialAuth backends.
 */
module.exports = BaseCollection.extend({
    model: SocialAuthBackend,
    url: "/api/v1/socialauth_backends/"
});