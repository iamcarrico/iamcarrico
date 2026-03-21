'use strict';

module.exports = {
  eleventyComputed: {
    // Mirrors Jekyll's permalink: /writings/:title/
    // page.fileSlug strips the YYYY-MM-DD- prefix from the filename automatically.
    permalink: (data) => `/writings/${data.page.fileSlug}/`,
  },
};
