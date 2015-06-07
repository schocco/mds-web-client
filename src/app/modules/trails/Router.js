var Marionette = require('backbone.marionette');

module.exports = Marionette.AppRouter.extend({
    appRoutes: {
        'trails'  : 'trailList',
        'trails/:id/' : 'trailDetail',
        'trails/upload': 'trailUpload'
    }
});
