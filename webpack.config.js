var path = require("path");
var webpack = require("webpack");
var entry = ['font-awesome-webpack!./src/app/conf/font-awesome.config.js', './src/app/App.js'],
  output = {
    path: __dirname,
    filename: 'App.js'
  };

module.exports.development = {
    debug : true,
    devtool : 'eval',
    entry: entry,
    output: output,
    module : {
        preLoaders: [
            {
                test: /\.js$/, // include .js files
                exclude: /node_modules/, // exclude any and all files in the node_modules folder
                loader: "jshint-loader"
            }
        ],
        loaders : [
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.css$/,    loader: 'style-loader!css-loader' },
            { test: /\.hbs$/,    loader: 'handlebars-loader?helperDirs[]=' + __dirname + '/src/app/modules/commons/templateHelpers' },
            // loaders for webfonts
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            { test:require.resolve('openlayers'), loader:"imports?define=>false" } // workaround for openlayers issue as in https://github.com/openlayers/ol3/issues/3162
        ]
    },
    resolve : {
        root: ["modules"],
        modulesDirectories: ['node_modules', 'modules']
    }
};

module.exports.production = {
    debug: true,
    entry: entry,
    output: output,
    module : {
        preLoaders: [
            {
                test: /\.js$/, // include .js files
                exclude: /node_modules/, // exclude any and all files in the node_modules folder
                loader: "jshint-loader"
            }
        ],
        loaders : [
            { test: /\.js?$/, loader: 'babel-loader!uglify-loader' },
            { test: /\.css$/,    loader: 'style-loader!css-loader' },
            { test: /\.hbs$/,    loader: 'handlebars-loader?helperDirs[]=' + __dirname + '/src/app/modules/commons/templateHelpers' },
            // loaders for webfonts
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            { test:require.resolve('openlayers'), loader:"imports?define=>false" } // workaround for openlayers issue as in https://github.com/openlayers/ol3/issues/3162
        ]
    },
    resolve : {
        root: ["modules"],
        modulesDirectories: ['node_modules', 'modules']
    }
};