let webpack = require('webpack');
let fs = require('fs');
let path = require('path');
let yargs = require('yargs');

let libName = 'fllscoreclient';
let libProxyName = 'fllscoreclientproxy';
let plugins = [];
let outputFile;
let outputProxyFile;

let nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

if(yargs.argv.p) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    outputFile = libName + '.min.js';
    outputProxyFile = libProxyName + '.min.js';
} else {
    outputFile = libName + '.js';
    outputProxyFile = libProxyName + '.js';
}

let clientConfig = {
    entry: [
        __dirname + '/src/client/index.ts'
    ],
    devtool: 'source-map',
    output: {
        path: path.join(__dirname + '/dist'),
        filename: outputFile,
        library: libName,
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

let serverConfig = {
    entry: [
        __dirname + '/src/proxy/index.ts'
    ],
    devtool: 'source-map',
    output: {
        path: path.join(__dirname + '/dist'),
        filename: outputProxyFile,
        library: libProxyName,
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
