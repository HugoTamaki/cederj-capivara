var gulp          = require('gulp');
var karma         = require('karma').server;

/*
 * TESTS
 */

gulp.task('test:unit', function (done) {
  karma.start({
    singleRun: true,
    configFile: __dirname + '/app/assets/javascripts/www/spec/karma.conf.js'
  }, function () {
    done();
    process.exit(0)
  })
});