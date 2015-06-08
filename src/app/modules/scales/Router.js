var Marionette = require('backbone.marionette');

module.exports = Marionette.AppRouter.extend({
    appRoutes: {
        'uxc-scale'  : 'uxc',
        'udh-scale'  : 'udh'
    }
});
