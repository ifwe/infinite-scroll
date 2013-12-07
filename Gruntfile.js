module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-karma-coveralls');

  grunt.initConfig({
    coveralls: {
      options: {
        coverage_dir: 'coverage/'
      }
    },

    karma: {
      options: {
        configFile: 'config/karma.conf.js'
      },
      coverage: {
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage']
      },
      test: {
        // Use defaults
      },
      dev: {
        singleRun: false
      },
      bdd: {
        reporters: ['story', 'coverage']
      },
      cobertura: {
        reporters: ['dots', 'coverage'],
        browsers: ['PhantomJS'],
        coverageReporter: {
          type : 'cobertura',
          dir : 'coverage/'
        }
      },
      travis: {
        singleRun: true,
        reporters: ['dots', 'coverage'],
        browsers: ['PhantomJS'],
        preprocessors: {
          'src/*.js': 'coverage'
        },
        coverageReporter: {
          type : 'lcov',
          dir : 'coverage/'
        }
      }
    },

    requirejs: {
      'build-minified': {
        options: {
          baseUrl: ".",
          include: ['bower_components/almond/almond'],
          stubModules: ['angular', 'jquery', 'underscore'],
          mainConfigFile: 'config/require.build.js',
          name: "src/taggedInfiniteScroll",
          optimize: "uglify2",
          preserveLicenseComments: false,
          out: "build/taggedInfiniteScroll.min.js",
          wrap: {
            end: "require('src/taggedInfiniteScroll');"
          }
        }
      },
      'build-unminified': {
        options: {
          baseUrl: ".",
          include: ['bower_components/almond/almond'],
          stubModules: ['angular', 'jquery', 'underscore'],
          mainConfigFile: 'config/require.build.js',
          name: "src/taggedInfiniteScroll",
          optimize: "none",
          useStrict: true,
          // skipModuleInsertion: true,
          preserveLicenseComments: false,
          out: "build/taggedInfiniteScroll.js",
          wrap: {
            end: "require('src/taggedInfiniteScroll');"
          }
        }
      }
    }
  });

  // Run tests, single pass
  grunt.registerTask('test', 'Run unit tests', ['karma:test']);

  // Run tests continously for development mode
  grunt.registerTask('dev', 'Run unit tests in watch mode', ['karma:dev']);

  // Generate a coverage report in Cobertura format
  grunt.registerTask('cobertura', 'Generate Cobertura coverage report', ['karma:cobertura']);

  // Build files for production
  grunt.registerTask('build', 'Builds files for production', ['requirejs:build-minified', 'requirejs:build-unminified']);

  // Travis CI task
  grunt.registerTask('travis', 'Travis CI task', ['karma:travis', 'coveralls']);
};
