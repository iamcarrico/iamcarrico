'use strict';

var gulp = require('gulp');
require('gulp-poole')(gulp);

var htmlmin = require('gulp-htmlmin')
var browserSync = require('browser-sync');

gulp.task('htmlmin', function() {
  return gulp.src('./docs/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./docs/'))
});


gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'docs'
    }
  });
});

gulp.task('deploy', ['build']);
