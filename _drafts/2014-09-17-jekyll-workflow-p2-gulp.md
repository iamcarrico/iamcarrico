---
layout: post
title:  "Jekyll Workflow Part 2: Automation with Gulp"
date:   2014-09-17 12:00:00
image: img/2014/gulpjs.png
categories:
  - jekyll
  - gulp
---

![Gulp.js](/img/2014/gulpjs.png)
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

To minify images, Mr. Poole first checks to see if any images have changed since the task last ran. If any changes have occurred, then he will minify the changed images. This will prevent images from being repeatedly minified, causing extra processing time.

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

## Jekyll Development

The site that we are building is definitely Jekyll, and Mr. Poole will ensure that we have a proper site for production and for development. He does this by giving two different ```_config.yml``` files, one for production and one with overrides for development. By default, Jekyll will pull the ```_config.yml```, but our Gulp command will also grab the ```_config.dev.yml``` for local development.

By default, Mr. Poole will turn off minification for stylesheets and JavaScript, show draft content, and hide anything in the analytics.html file. Any other variable within the config file can also be overridden just by adding values to the ```_config.dev.yml```.

```js
gulp.task('jekyll-dev', function (done) {
  browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml,_config.dev.yml'], {stdio: 'inherit'})
    .on('close', done);
});
```

The Gulp task itself just runs the ```jekyll build``` command, as we would do normally if we were not using Gulp. Mr. Poole always wants to make sure we are using the right gems as well, so he will always choose to run commands through [Bundler](http://bundler.io/).

## Watching File Changes

All of these tasks wouldn't be useful without Gulp also watching our files, ensuring that any changes in files will re-run Gulp tasks. Gulp makes this incredibly simple just by the ```gulp.watch()```. The command takes two arguments, the first is the paths to watch, the second is the command   (or array of commands) to run.

```js
gulp.task('watch', function() {
  gulp.watch(paths.sass + '/**/*.scss', ['sass']);
  gulp.watch(paths.imagesSrc + '/**/*', function() {
    runSequence(['images'], ['jekyll-rebuild'])
  });
  gulp.watch(paths.jekyll, ['jekyll-rebuild']);
});
```

The task for images utilizes [run-sequence](https://github.com/OverZealous/run-sequence) to ensure the images are minfied before being updated in the Jekyll site.

## BrowserSync

The magic that pulls everything together, is [BrowserSync](http://www.browsersync.io/). Instead of using the Jekyll's built in server, BrowserSync will act as the web server. BrowserSync will also ensure that any updated files will be automatically reloaded into the browser, without the need to refresh. BrowserSync also makes it easy to test multiple devices by ensuring any clicks in one browser are replicated in all other connected browsers.

```js
gulp.task('browserSync', function() {
    browserSync({
      server: {
        baseDir: "_site"
      }
    });
  });
```

The task itself is just as simple as ensuring the server will be ran from Jekyll's ```_site``` directory. By running ```gulp server```, Gulp will run all the previous tasks, including BrowserSync, and launch a browser with the appropriate IP and ports. In the previous tasks, the ```browserSync.notify()``` function will send some HTML to the browser, alerting the user of any changes that are happening.

## How can I use it?

The [Mr. Poole](https://github.com/iamcarrico/generator-poole) is setup to automatically allow the use of these commands. To use it on an existing Jekyll site, copy these commands into your own Gulpfile. You can also install the commands locally with:

```bash
$ npm install -g gulp-poole
```

and put the following code in the top of your Gulpfile:

```js
var gulp = require('gulp');
require('gulp-poole')(gulp);
```

The full source code for the Gulp tools in Mr. Poole can be found on my GitHub page at https://github.com/iamcarrico/gulp-poole.
