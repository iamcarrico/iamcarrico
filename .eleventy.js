'use strict';

const path = require('path');
const sass = require('sass');
const { minify } = require('terser');
const yaml = require('js-yaml');
const { DateTime } = require('luxon');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const Image = require('@11ty/eleventy-img');

const isProd = process.env.ELEVENTY_ENV === 'production';

module.exports = function(eleventyConfig) {

  // Syntax highlighting — Prism.js at build time, no runtime JS
  eleventyConfig.addPlugin(syntaxHighlight);

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
  eleventyConfig.addPairedShortcode('figure', async function(caption, src, alt) {
    const captionHtml = caption.trim() ? `\n  <figcaption>${caption.trim()}</figcaption>` : '';

    try {
      const metadata = await Image('.' + src, {
        widths: [400, 800, 1600],
        formats: ['webp', 'jpeg'],
        outputDir: './docs/img/',
        urlPath: '/img/',
        sharpWebpOptions: { quality: 90 },
        sharpJpegOptions: { quality: 90, progressive: true },
      });

      const imageHtml = Image.generateHTML(metadata, {
        alt: alt || '',
        sizes: '(min-width: 48em) 748px, 100vw',
        loading: 'lazy',
        decoding: 'async',
      });

      return `<figure>\n  ${imageHtml}${captionHtml}\n</figure>`;
    } catch(e) {
      // Image not found (e.g. placeholder in a draft) — fall back to plain img
      return `<figure>\n  <img src="${src}" alt="${alt || ''}">${captionHtml}\n</figure>`;
    }
  });

  // Image URL filter — runs eleventy-img and returns a single generated URL.
  // Use for meta tags and anywhere a plain URL (not markup) is needed.
  eleventyConfig.addAsyncFilter('imageUrl', async function(src, width, format) {
    if (!src) return src;
    const fmt = format || 'jpeg';
    const filePath = './' + src.replace(/^\//, '');
    try {
      const metadata = await Image(filePath, {
        widths: [width || 1200],
        formats: [fmt],
        outputDir: './docs/img/',
        urlPath: '/img/',
        sharpJpegOptions: { quality: 90, progressive: true },
        sharpWebpOptions: { quality: 90 },
      });
      return metadata[fmt][0].url;
    } catch(e) {
      return src;
    }
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
