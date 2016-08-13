/* eslint import/no-extraneous-dependencies: "off" */
/* eslint no-console: "off" */

const webpack = require('webpack');

const sauceLaunchers = {
  'chrome-latest-osx': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'OS X 10.11',
  },
  'chrome-previous-osx': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest-1',
    platform: 'OS X 10.11',
  },
  'firefox-latest-osx': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'OS X 10.11',
  },
  'firefox-previous-osx': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest-1',
    platform: 'OS X 10.11',
  },
  'edge-latest-win10': {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    version: 'latest',
    platform: 'Windows 10',
  },
};

module.exports = function karma(config) {
  let browsers = [];
  let customLaunchers = {};

  if (process.env.TRAVIS_BUILD_NUMBER) {
    if (process.env.TRAVIS_SECURE_ENV_VARS === 'true' &&
        process.env.SAUCE_USERNAME &&
        process.env.SAUCE_ACCESS_KEY) {
      // We're on Travis, and Sauce Labs environment variables are available.
      // Run on the Sauce Labs cloud using the full set of browsers.

      console.log('Running on Sauce Labs.');

      customLaunchers = sauceLaunchers;
      browsers = Object.keys(customLaunchers);
    } else {
      // We're on Travis, but Sauce Labs environment variables aren't available.
      // Run on Travis, using Firefox.

      console.log('Running on Travis.');

      browsers = [
        'Firefox',
      ];
    }
  } else {
    // This is a local run. Use Chrome.

    console.log('Running locally.');

    browsers = [
      'Chrome',
    ];
  }

  let testDirs = [
    'specs',
    'integration',
  ];

  if (config.dir) {
    testDirs = config.dir.split(',');
  }

  const files = testDirs.map(dir => `test/${dir}/*.js`);

  config.set({
    browsers,
    customLaunchers,
    files,

    frameworks: [
      'mocha',
      'chai',
    ],

    reporters: [
      'mocha',
      'saucelabs',
    ],

    autoWatch: true,
    singleRun: config.singleRun === 'true',

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

    sauceLabs: {
      testName: 'cspace-api tests',
      recordScreenshots: false,
      public: true,
    },
  });
};
