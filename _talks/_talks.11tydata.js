'use strict';

module.exports = {
  eleventyComputed: {
    // Mirrors Jekyll's permalink: /talks/:year/:path/
    // Talks that already define their own permalink in front matter will override this.
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      const year = new Date(data.page.date).getFullYear();
      return `/talks/${year}/${data.page.fileSlug}/`;
    },
  },
};
