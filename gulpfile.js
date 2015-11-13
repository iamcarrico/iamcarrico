'use strict';

var gulp = require('gulp');
require('gulp-poole')(gulp);

//////////////////////////////
// Deploy Task
// Because we dont want to deploy to gh-pages.
//////////////////////////////
gulp.task('deploy', ['build'])
