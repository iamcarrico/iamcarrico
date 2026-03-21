'use strict';

module.exports = {
  layout: 'theboysclub',
  eleventyComputed: {
    permalink: (data) => `/the-boys-club/${data.page.fileSlug}/`,
  },
};
