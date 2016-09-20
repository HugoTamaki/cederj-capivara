module.exports = function (config) {
  config.set({
    basePath: './',
    preprocessors: {
      '../../www/**/*.js': ['coverage']
    },
    files: [
      "../../lib/angular/angular.js",
      "../../lib/angular-mocks/angular-mocks.js",
      "../../lib/angular-mocks/ngMock.js",
      'phantomjs-fix.js',
      "../app.js",
      "../controllers/*.js",
      "../directives/*.js",
      "../factories/*.js",
      "../services/*.js",
      'unit/**/*.js'
    ],
    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-json-fixtures-preprocessor'
    ],
    jsonFixturesPreprocessor: {
      camelizeFilenames: true
    }
  });
};