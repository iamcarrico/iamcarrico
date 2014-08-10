---
layout: post
title:  "Deploying to GitHub Pages"
date:   2014-09-10 12:00:00
categories: jekyll gulp
---

[GitHub Pages](https://pages.github.com/) has for a long time allowed free, easy, and hassel-free hosting on GitHub. It can be as simple as creating a ```gh-pages``` branch in a repository, and pushing that to GitHub. Or, for a more complete solution, [Gulp.js](http://gulpjs.com/) can be used to build, minfiy, concatenate, and publish a Jekyll site. By using Gulp, there is the option of using other Jekyll extensions, and improving the workflow in the process.


```js

gulp.task('sass', function() {
  browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
  return gulp.src(paths.sass + '/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: paths.css,
      sass: paths.sass,
      bundle_exec: true,
      time: true
    }))
    .pipe(prefix("last 2 versions", "> 1%"))
    .pipe(gulp.dest(paths.css))
    .pipe(gulp.dest(paths.assets))
    .pipe(browserSync.reload({stream:true}));
});
```
