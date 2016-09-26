module.exports = function (config) {
  config.set({
    basePath: './',
    preprocessors: {
      '../../www/**/*.js': ['coverage'],
      '../../../templates/**/*.html': ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {
      moduleName: 'templates'
    },
    files: [
      "../../lib/underscore/underscore-min.js",

      "../../lib/angular/angular.js",
      "../../lib/angular-mocks/angular-mocks.js",
      "../../lib/angular-ui-router/release/angular-ui-router.min.js",
      "../../lib/underscore/underscore-min.js",
      "../../lib/moment/min/moment.min.js",
      "../../lib/moment/min/locales.min.js",
      "../../lib/angular-local-storage/dist/angular-local-storage.min.js",
      "../../lib/spin.js/spin.min.js",
      "../../lib/angular-spinner/angular-spinner.min.js",

      "../../../templates/**/*.html",

      "../app.js",
      "../controllers/*.js",
      "../directives/*.js",
      "../factories/*.js",
      "../services/*.js",
      'phantomjs-fix.js',
      'unit/**/*.js'
    ],
    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-json-fixtures-preprocessor',
      'karma-ng-html2js-preprocessor'
    ],
    jsonFixturesPreprocessor: {
      camelizeFilenames: true
    }
  });
};