var Marionette = require('backbone.marionette');

module.exports = Marionette.AppRouter.extend({
    appRoutes: {
        'trails'  : 'trailList',
        'trails/upload/': 'trailUpload',
        'trails/:id/' : 'trailDetail'
    }
});
