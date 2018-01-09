var webpack = require('webpack');
var fs = require('fs');
var path = require('path');
var yargs = require('yargs');

var libraryName = 'fllscoreclient';
var libServerName = 'fllscoreclientserver';
var plugins = [];
var outputFile;
var outputServerFile;

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

if(yargs.argv.p) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    outputFile = libraryName + '.min.js';
    outputServerFile = libServerName + '.min.js';
} else {
    outputFile = libraryName + '.js';
    outputServerFile = libServerName + '.js';
}

var clientConfig = {
    entry: [
        __dirname + '/src/index.ts'
    ],
    devtool: 'source-map',
    output: {
        path: path.join(__dirname + '/dist'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    target: 'web',
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'tslint-loader', enforce: 'pre'},
            {test: /\.ts$/, loader: 'ts-loader'},
            {test: /\.node$/, loader: 'node-loader'},
            {test: /\.json$/, loader: 'json-loader'}
        ],
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    plugins: plugins,
    node: {
        console: true,
    }
};

var serverConfig = {
    entry: [
        __dirname + '/src/indexServer.ts'
    ],
    devtool: 'source-map',
    output: {
        path: path.join(__dirname + '/dist'),
        filename: outputServerFile,
        library: libServerName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    target: 'node',
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'tslint-loader', enforce: 'pre'},
            {test: /\.ts$/, loader: 'ts-loader'},
            {test: /\.node$/, loader: 'node-loader'},
            {test: /\.json$/, loader: 'json-loader'}
        ],
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    plugins: plugins,
    externals: nodeModules
};


module.exports = [clientConfig, serverConfig];
