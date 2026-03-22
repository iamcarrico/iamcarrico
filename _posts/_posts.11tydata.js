'use strict';

const Image = require('@11ty/eleventy-img');

module.exports = {
  eleventyComputed: {
    // Mirrors Jekyll's permalink: /writings/:title/
    // page.fileSlug strips the YYYY-MM-DD- prefix from the filename automatically.
    permalink: (data) => `/writings/${data.page.fileSlug}/`,

    // Pre-compute teaser image URL so templates can use it as a plain string.
    teaserImageUrl: async (data) => {
      if (!data.image) return null;
      const filePath = './' + data.image.replace(/^\//, '');
      try {
        const metadata = await Image(filePath, {
          widths: [600],
          formats: ['jpeg'],
          outputDir: './docs/img/',
          urlPath: '/img/',
          sharpJpegOptions: { quality: 90, progressive: true },
        });
        return metadata.jpeg[0].url;
      } catch(e) {
        return data.image;
      }
    },
  },
};
