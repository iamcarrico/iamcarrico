'use strict';

var gulp = require('gulp');
require('gulp-poole')(gulp);


//////////////////////////////
// Deploy Task
//////////////////////////////
gulp.task('deploy', function(cb) {
  return runSequence(
    'build',
    'commit',
    cb
  );
});

//////////////////////////////
// Publishing Task
//////////////////////////////
gulp.task('commit', function () {
  gulp.src("./_site/**/*")
    .pipe(deploy({
      cacheDir: '.tmp',
      branch: 'live'
    })).pipe(gulp.dest('/tmp/gh-pages')); ;
});

}
