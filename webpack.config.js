var nodeExternals = require('webpack-node-externals');
var path = require('path');

module.exports = {
  entry: './handler.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve('.webpack'),
    filename: 'handler.js', // this should match the first part of function handler in serverless.yml
  },
  module: {
    loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
    }]
  }
};