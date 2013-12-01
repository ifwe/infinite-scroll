module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    karma: {
      options: {
        configFile: 'config/karma.conf.js'
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
      }
    }
  });

  // Run tests, single pass
  grunt.registerTask('test', 'Run unit tests', ['karma:test']);

  // Run tests continously for development mode
  grunt.registerTask('dev', 'Run unit tests in watch mode', ['karma:dev']);

  // Generate a coverage report in Cobertura format
  grunt.registerTask('cobertura', 'Run unit tests in watch mode', ['karma:cobertura']);
};
