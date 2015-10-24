var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var babelify = require("babelify");
var source = require('vinyl-source-stream');
var gulpTraceurCmdline = require('gulp-traceur-cmdline');

gulp.task('browserify', function() {
  browserify('./src/js/main.js')
    .transform('babelify')
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function() {
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
  gulp.src('src/assets/**/*.*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('gulpTraceurCmdline',function() {
  gulp.src("./src/js/main.js")
    .pipe(gulpTraceurCmdline('/usr/local/bin/traceur', {
      modules : 'inline',
      out     : './dist/js/main.js',
      debug   : false
    }))
});

gulp.task('default',['browserify','copy'], function() {
  return gulp.watch('src/**/*.*', ['browserify', 'copy'])
})
