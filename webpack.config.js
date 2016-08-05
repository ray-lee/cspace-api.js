/* eslint import/no-extraneous-dependencies: "off" */
const webpack = require('webpack');

const env = process.env.NODE_ENV;

const config = {
  entry: './index.js',
  output: {
    path: 'dist',
    filename: 'CSpaceAPI.js',
    library: 'CSpaceAPI',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
}

module.exports = config;
