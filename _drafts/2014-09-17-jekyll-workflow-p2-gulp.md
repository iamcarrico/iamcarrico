---
layout: post
title:  "Jekyll Workflow Part 2: Automation with Gulp"
date:   2014-09-17 12:00:00
image:
  url: img/2014/gulpjs.png
  alt: "Gulp.js"
categories:
  - jekyll
  - gulp
---

The [first blog post](/writings/jekyll-workflow-p1-building/) in this series talked about how to use the [Mr. Poole Generator](https://github.com/iamcarrico/generator-poole) to create a custom Jekyll site. The generator packs in many features to create amazing blogs or static sites. Probably the most powerful portion of the generator is the [Gulp.js](http://gulpjs.com) tasks that come bundled in the [Gulp tools for Poole](https://github.com/iamcarrico/gulp-poole).

This post will go over the main tasks that Mr. Poole runs, and how they were made. The source code can be found completely at https://github.com/iamcarrico/gulp-poole. The package is also published to npm, therefore it can be installed on any project.

## Sass Compiling

Mr. Poole uses [Compass](http://compass-style.org/) to compile our Sass files. He uses several npm tasks to make our lives a little easier, minifying our CSS and adding in vendor-prefixes without having to use Compass's mixins. To start, grab the required npm packages, and add them to your gulpfile.js.

```js
var paths = require('compass-options').dirs();
var compass = require('gulp-compass');
var prefix = require('gulp-autoprefixer');
```

The task itself pulls the current paths from Compass's config.rb file. Gulp then sources those files, and pipes them to Compass. A few important pieces to note here is that we have ```bundle_exec: true``` to ensure that Compass runs through bundler. Next, we send the compiled CSS files through [autoprefixer](https://github.com/ai/autoprefixer) to ensure we have the proper vendor prefixes on our CSS. Finally, we send the compiled and prefixed CSS to the local css directory and the assets directory used by Jekyll. Finally, we trigger [BrowserSync](#browsersync) to reload the CSS files within the browser.

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

This task, just like any of the tasks within the gulpfile, can be overriden with ones within your project's own gulpfile. Just ensure that the task name is the same as the task in Mr. Poole's gulpfile.

## Image Minification

To minify images, Mr. Poole first checks to see if any images have changed since the task last ran. If any changes have occurred, then he will minify the changed images. This will prevent images from being repeatedly minified, causing extra procesing time.

```js
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');

gulp.task('images', function() {
  return gulp.src(paths.imagesSrc + '/**/*')
    .pipe(changed(paths.img))
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.img));
});
```

## Watching File Changes

```js
gulp.task('watch', function() {
  gulp.watch(paths.sass + '/**/*.scss', ['sass']);
  gulp.watch(paths.imagesSrc+ '/**/*', function() {
    runSequence(['images'], ['jekyll-rebuild'])
  });
  gulp.watch(paths.jekyll, ['jekyll-rebuild']);
});
```


## BrowserSync

http://www.browsersync.io/

```js
gulp.task('browserSync', function() {
    browserSync({
      server: {
        baseDir: "_site"
      }
    });
  });
```

## Jekyll Development


```js
gulp.task('jekyll-dev', function (done) {
  browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml,_config.dev.yml'], {stdio: 'inherit'})
    .on('close', done);
});
```
