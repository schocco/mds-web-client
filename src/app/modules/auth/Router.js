var Marionette = require('backbone.marionette');

module.exports = Marionette.AppRouter.extend({
    appRoutes: {
        'login'  : 'login',
        'profile'  : 'profile'
    }
});
