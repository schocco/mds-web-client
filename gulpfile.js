var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var $ = require('gulp-load-plugins')();
var del = require('del');
var url = require('url');
var proxy = require('proxy-middleware');

var environment = $.util.env.type || 'development'; // run `gulp build --type production` for a production build
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js')[environment];


var port = $.util.env.port || 1337;
var src = 'src/';
var dist = 'dist/';

var autoprefixerBrowsers = [
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 6',
    'opera >= 23',
    'ios >= 6',
    'android >= 4.4',
    'bb >= 10'
];


gulp.task('scripts', function () {
    return gulp.src(webpackConfig.entry)
        .pipe($.webpack(webpackConfig))
        .pipe(gulp.dest(dist))
        .pipe($.size({title: 'js'}))
        .pipe($.connect.reload());
});

gulp.task('html', function () {
    return gulp.src(src + 'index.html')
        .pipe(gulp.dest(dist))
        .pipe($.size({title: 'html'}))
        .pipe($.connect.reload());
});

gulp.task('styles', function () {
    return gulp.src(src + 'less/style.less')
        .pipe(less({
            paths: [src + 'less', src + 'less/base', src + 'less/base/animations']
        })).pipe(isProduction ? $.cssmin() : $.util.noop())
        .pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
        .pipe(gulp.dest(dist + 'css/'))
        .pipe($.size({title: 'css'}))
        .pipe($.connect.reload());
});


gulp.task('serve', function() {
    $.connect.server({
        root: ['dist'],
        port: 9000,
        livereload: true,
        middleware: function(connect, o) {
            return [ (function() {
                var url = require('url');
                var proxy = require('proxy-middleware');
                var options = url.parse('http://localhost:8000/api/');
                options.route = '/api/';
                return proxy(options);
            })() ];
        }
    });
});

gulp.task('static', function (cb) {
    return gulp.src(src + 'static/**/*')
        .pipe($.size({title: 'static'}))
        .pipe(gulp.dest(dist + 'static/'));
});

gulp.task('watch', function () {
    gulp.watch(src + 'less/**/*.less', ['styles']);
    gulp.watch(src + 'index.html', ['html']);
    gulp.watch(src + 'app/**/*.hbs', ['scripts']);
    gulp.watch(src + 'app/**/*.js', ['scripts']);
    gulp.watch('webpack.config.js', ['scripts']);
});

gulp.task('clean', function (cb) {
    del([dist], cb);
});


// by default build project and then watch files in order to trigger livereload
gulp.task('default', ['build', 'serve', 'watch']);

// waits until clean is finished then builds the project
gulp.task('build', ['clean'], function () {
    gulp.start(['static', 'html', 'scripts', 'styles']);
});
