window.googletag = { cmd: { push: function(){  } } };

var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return (/Spec\.js$/).test(file);
});

requirejs.config({
  baseUrl: '/base',
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
  },
  deps: tests,
  callback: window.__karma__.start
});
