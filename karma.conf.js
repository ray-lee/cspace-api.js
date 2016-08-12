/* eslint import/no-extraneous-dependencies: "off" */

const webpack = require('webpack');

module.exports = function karma(config) {
  config.set({
    browsers: [
      'Chrome',
    ],

    frameworks: [
      'mocha',
      'chai',
    ],

    reporters: [
      'mocha',
    ],

    files: [
      'test/**/*.spec.js',
      'test/**/*.test.js',
    ],

    autoWatch: true,
    singleRun: false,

    preprocessors: {
      'test/**/*.js': [
        'webpack',
        'sourcemap',
      ],
    },

    webpack: {
      devtool: 'cheap-module-inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
      ],
    },

    port: 9876,
    colors: true,
  });
};
