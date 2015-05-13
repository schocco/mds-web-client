var Marionette = require('backbone.marionette');

module.exports = Marionette.AppRouter.extend({
    appRoutes: {
        'mts'  : 'mscale',
        'mscale'  : 'mscale'
    }
});
