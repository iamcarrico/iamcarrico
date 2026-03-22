'use strict';

const fs = require("node:fs");
const path = require('path');
const sass = require('sass');
const { minify } = require('terser');
const yaml = require('js-yaml');
const { DateTime } = require('luxon');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const Image = require('@11ty/eleventy-img');
const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img');

const IMAGE_OPTIONS = {
  widths: [400, 800, 1600],
  formats: ['webp', 'jpeg'],
  outputDir: '.cache/@11ty/img/',
  urlPath: '/img/built/',
  inputDir: '.',
  sharpWebpOptions: { quality: 90 },
  sharpJpegOptions: { quality: 90, progressive: true },
};

const isProd = process.env.ELEVENTY_ENV === 'production';

module.exports = function(eleventyConfig) {

  // Syntax highlighting — Prism.js at build time, no runtime JS
  eleventyConfig.addPlugin(syntaxHighlight);

  // Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, IMAGE_OPTIONS);

	eleventyConfig.on("eleventy.after", () => {
		fs.cpSync(".cache/@11ty/img/", "_site/img/built/", { recursive: true });
	});

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

  // Exclude draft posts from production builds
  eleventyConfig.addPreprocessor('drafts', '*', (data) => {
    if (isProd && data.draft) return false;
  });

  // Ignore directories/files that shouldn't be compiled as pages
  eleventyConfig.ignores.add('_site');
  eleventyConfig.ignores.add('README.md');

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

  eleventyConfig.addCollection('boysclub', function(api) {
    return api.getFilteredByGlob('_the-boys-club/**/*.md')
      .sort((a, b) => b.date - a.date);
  });

  // Shortcodes
  eleventyConfig.addPairedShortcode('figure', function(caption, src, alt) {
    const captionHtml = caption.trim() ? `\n  <figcaption>${caption.trim()}</figcaption>` : '';
    return `<figure>\n  <img src="${src}" alt="${alt || ''}" sizes="(min-width: 48em) 748px, 100vw" loading="lazy" decoding="async">${captionHtml}\n</figure>`;
  });

  // Image URL filter — runs eleventy-img and returns a single generated URL.
  // Use for meta tags and anywhere a plain URL (not markup) is needed.
  eleventyConfig.addAsyncFilter('imageUrl', async function(src, width, format) {
    if (!src) return src;
    const fmt = format || 'jpeg';
    const filePath = './' + src.replace(/^\//, '');

    const metadata = await Image(filePath, {
      widths: [width || 1200],
      formats: [fmt],
      ...IMAGE_OPTIONS,
    });

    return metadata[fmt][0].url;
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
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
