'use strict';

const path = require('path');
const sass = require('sass');
const { minify } = require('terser');
const yaml = require('js-yaml');
const { DateTime } = require('luxon');

const isProd = process.env.ELEVENTY_ENV === 'production';

module.exports = function(eleventyConfig) {

  // Sass compilation — partials (starting with _) are skipped
  eleventyConfig.addTemplateFormats('scss');
  eleventyConfig.addExtension('scss', {
    outputFileExtension: 'css',
    compile: function(_inputContent, inputPath) {
      const parsed = path.parse(inputPath);
      if (parsed.name.startsWith('_')) return;

      return () => {
        const result = sass.compile(inputPath, {
          style: isProd ? 'compressed' : 'expanded',
          sourceMap: false,
        });
        return result.css;
      };
    },
  });

  // JS compilation — minify in production via esbuild; only top-level js/ files (not vendor/)
  eleventyConfig.addTemplateFormats('js');
  eleventyConfig.addExtension('js', {
    outputFileExtension: 'js',
    compile: function(inputContent, inputPath) {
      if (!/^\.\/js\/[^/]+\.js$/.test(inputPath)) return;

      return async () => {
        if (!isProd) return inputContent;
        const result = await minify(inputContent);
        return result.code;
      };
    },
  });

  // YAML data file support (.yaml and .yml)
  eleventyConfig.addDataExtension('yaml,yml', (contents) => yaml.load(contents));

  // Ignore old Jekyll build output
  eleventyConfig.ignores.add('_site');

  // Passthrough copies
  eleventyConfig.addPassthroughCopy('img');
  eleventyConfig.addPassthroughCopy('fonts');
  eleventyConfig.addPassthroughCopy('CNAME');

  // Layout aliases — lets existing front matter (layout: post) keep working
  eleventyConfig.addLayoutAlias('default', 'default.njk');
  eleventyConfig.addLayoutAlias('post', 'post.njk');
  eleventyConfig.addLayoutAlias('talk', 'talk.njk');
  eleventyConfig.addLayoutAlias('error', 'error.njk');
  eleventyConfig.addLayoutAlias('theboysclub', 'theboysclub.njk');

  // Collections
  eleventyConfig.addCollection('posts', function(api) {
    return api.getFilteredByGlob('_posts/**/*.md')
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection('talks', function(api) {
    return api.getFilteredByGlob('_talks/**/*.md')
      .sort((a, b) => b.date - a.date);
  });

  // Filters
  eleventyConfig.addFilter('dateFormat', function(date, format) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(format);
  });

  eleventyConfig.addFilter('currentYear', function() {
    return new Date().getFullYear();
  });

  eleventyConfig.addFilter('startsWith', function(str, prefix) {
    return String(str).startsWith(prefix);
  });

  eleventyConfig.addFilter('striptags', function(html) {
    if (!html) return '';
    return html.replace(/(<([^>]+)>)/gi, '');
  });

  // Make ELEVENTY_ENV available to templates
  eleventyConfig.addGlobalData('env', process.env.ELEVENTY_ENV || 'development');

  return {
    dir: {
      input: '.',
      output: 'docs',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
