// Karma configuration
// Generated on Sat Sep 07 2013 11:02:19 GMT-0700 (PDT)
module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../',
    urlRoot: '/base/',

    // frameworks to use
    frameworks: ['mocha', 'requirejs', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      {pattern: 'src/**/**.js', included: false},
      {pattern: 'bower_components/**/**.js', included: false},
      {pattern: 'tests/**/**.js', included: false},
      'config/require.conf.js'
    ],

    preprocessors: {
      'src/taggedInfiniteScroll.js': ['coverage']
    },

    // list of files to exclude
    exclude: [],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots', 'coverage'],

    hostname: '0.0.0.0',

    // web server port
    port: 3000,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome', 'Firefox', 'PhantomJS', 'Safari'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 90000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    plugins: [
      // these plugins will be require() by Karma
      'karma-requirejs',
      'karma-mocha',
      'karma-sinon-chai',

      // Launchers
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-safari-launcher',
      
      // Reporters
      'karma-coverage',
      'karma-junit-reporter',
      'karma-story-reporter'
    ],

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }
  });
};
