var webpack = require('webpack');
var path = require('path');
var yargs = require('yargs');

var libraryName = 'fllscoreclient';
var plugins = [];
var outputFile;

if(yargs.argv.p) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
}

var config = {
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
    target: 'node',
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader'}
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    plugins: plugins,
};

module.exports = config;
