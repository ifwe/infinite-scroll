requirejs.config({
  baseUrl: '.',
  paths: {
    'angular': 'bower_components/angular/angular',
    'angular/mocks': 'bower_components/angular-mocks/angular-mocks',
    'jquery': 'bower_components/jquery/jquery',
    'underscore': 'bower_components/underscore/underscore'
  },
  shim: {
    'angular': {
      'exports': 'angular',
      'deps': ['jquery']
    },
    'angular/mocks': {
      'deps': ['angular']
    },
    'underscore': {
      'exports': '_'
    }
  }
});
