---
layout: post
title:  "Jeb! 2016 Performance Audit"
date:   2015-06-18 12:00:00
categories:
  - performance
  - perf-audit
image: "img/2015/jeb.png"
description: "A performance review of jeb2016.com, and how the performance of the campaign site can be improved."
shortlink: http://iamc.co/1eqwyyX
---

<figure>
  <img src="/img/2015/jeb.png" alt="¡Jeb!">
  <figcaption>A recreation of the Jeb! Campaign logo. This post is in no way affiliated with the official campaign.</figcaption>
</figure>

Wanting to always be fair with my work— I have completed a performance review of the Jeb! Campaign site. This is similar to the work I did for the [Hillary Clinton performance audit](https://iamcarrico.com/writings/hillary-clinton-performance-audit/) I did last month, and follows the same general workflow.

* [Tests](#tests)
* [Overview](#overview)
* [Server configuration](#server-configuration)
* [DNS lookups](#dns-lookups)
* [CDN use](#cdn-use)
* [Asset loading](#asset-loading)
* [Pre-rendering](#pre-rendering)


## Tests

Tested via Web Page Test from various locations and speeds. Any screenshots will be tested from Chrome, throttled to 2g speeds, unless otherwise noted.

For a complete list of Web Page Test results that were used in the making of this audit, please see below.

Various Locations, Chrome, 3G

* [http://www.webpagetest.org/result/150618_KZ_P3W/](http://www.webpagetest.org/result/150618_KZ_P3W/)
* [http://www.webpagetest.org/result/150618_R0_P44/](http://www.webpagetest.org/result/150618_R0_P44/)
* [http://www.webpagetest.org/result/150618_D6_P54/](http://www.webpagetest.org/result/150618_D6_P54/)
* [http://www.webpagetest.org/result/150618_N1_P5E/](http://www.webpagetest.org/result/150618_N1_P5E/)
* [http://www.webpagetest.org/video/compare.php?tests=150618_N1_P5E,150618_D6_P54,150618_R0_P44,150618_KZ_P3W](http://www.webpagetest.org/video/compare.php?tests=150618_N1_P5E,150618_D6_P54,150618_R0_P44,150618_KZ_P3W)

Dulles, Chrome, 3G v Cable

* [http://www.webpagetest.org/result/150618_PD_P7A/](http://www.webpagetest.org/result/150618_PD_P7A/)
* [http://www.webpagetest.org/result/150618_CE_P7G/](http://www.webpagetest.org/result/150618_CE_P7G/)
* [http://www.webpagetest.org/video/compare.php?tests=150618_CE_P7G,150618_PD_P7A](http://www.webpagetest.org/video/compare.php?tests=150618_CE_P7G,150618_PD_P7A)

Dulles, IE8 v IE9 v Chrome, Cable

* [http://www.webpagetest.org/result/150618_Q3_PA5/](http://www.webpagetest.org/result/150618_Q3_PA5/)
* [http://www.webpagetest.org/result/150618_6Z_PA8/](http://www.webpagetest.org/result/150618_6Z_PA8/)
* [http://www.webpagetest.org/result/150618_CE_P7G/](http://www.webpagetest.org/result/150618_CE_P7G/)
* [http://www.webpagetest.org/video/compare.php?tests=150618_6Z_PA8,150618_Q3_PA5,150618_CE_P7G](http://www.webpagetest.org/video/compare.php?tests=150618_6Z_PA8,150618_Q3_PA5,150618_CE_P7G)

Dulles, Chrome Cable v Motorola E 3G

* [http://www.webpagetest.org/result/150618_CE_P7G/](http://www.webpagetest.org/result/150618_CE_P7G/)
* [http://www.webpagetest.org/result/150618_TP_PCN/](http://www.webpagetest.org/result/150618_TP_PCN/)
* [http://www.webpagetest.org/video/compare.php?tests=150618_TP_PCN,150618_CE_P7G](http://www.webpagetest.org/video/compare.php?tests=150618_TP_PCN,150618_CE_P7G)

## Overview

Currently, on a 2g connection (450kbps / 150ms RTT), it takes just below 10s for the header to be visible. However, since there are JavaScript frameworks that are used to display content (without server-side pre-rendering) it takes over 16 seconds for any meaningful content to be visible.

![Network view of Jeb!](/img/2015/jeb-overview-load.png)

The site has a few performance-enhancing methods employed, but not efficiently enough to have the content get to the user quickly. Overall— it is a good start with some fixes that can be made to make the site much faster with minimal code changes. Many of the problems are similar to the Hillary Clinton site, and thus will be similar to what was written for [my review of her campaign site](https://docs.google.com/document/d/11-nW6Z_MjPboO1u9n7PTgQBwgnO3v-5hs3mhO0YWszE/edit?usp=sharing).

## Server configuration

All JavaScript and CSS assets loaded from the primary domain do not have the proper expires headers. These need to be set for proper caching on all browsers, to ensure the same file is not downloaded more than once. The same is true for API calls to api.jeb2016.com and cms.jeb2016.com. Finally, the cloudfront instance in front of the static assets (mainly images) are not using any expires headers either. These domains are using etags, which will cause the asset not to be re-downloaded— but there will still be extra requests that are not needed.

## DNS lookups

To display meaningful content on the page, over 6 domains are used to obtain assets. This should be reduced to one domain for the critical path to load, then using third-party or extra domains to load extra resources. This will reduce the overall overhead to start the first full render of the site.

## CDN use

Currently, jeb2016.com is accessible on only one server in Virginia. This means that anybody on the west coast will have a far slower experience on the site. This is most apparent in looking at the filmstrip view of the site loading from various corners of the United States.

![Filmstrip of Jeb! loading from different parts of the USA](/img/2015/jeb-filmstrip.png)

The second row is loading from NYC, and is loaded 5x faster than other locations (NYC loads in 3s compared to Denver’s 15s). Using a CDN in front of the primary site will greatly improve this experience, ensuring that users are not penalized for being a further distance from the server.

## Asset loading

Outside of the using a CDN, more efficient loading of assets will create the largest impact on overall performance of the site. Currently, the JavaScript on the site is separated into 8 different files that should be concatenated into one, or at the very least use the async attribute to ensure they do not block the rendering of the page. If each is using the async attribute (with a defer attribute to fallback for older IE browsers) then the scripts can be put back into the head.

This is no more apparent than in the downloading of the typekit fonts. Currently, the typekit fonts are holding back the first real render of any content. It is better to get content to the users quickly, then to wait on 3rd party libraries to load their fonts.

A few minor notes to ensure the site is up to best practices, but by no means will make the site directly faster. First off, using the protocol-less url for asset loading has been an anti-pattern for some time. All assets that can be downloaded via https, should be downloaded via https. Also, the use of UA sniffers has also become an anti-pattern, and it is far more useful (and accurate) to use feature detection. Modernizr is a great tool to do this, with many tests built directly into it.

## Pre-rendering

Due to the use of client side frameworks, the content is reliant on not just the html and styles being delivered, but also several javascript files before an api call can be made to get the full content that should be delivered. This delay can be mitigated by having content be pre-rendered on the server to display the first page load, then have any additional content be loaded within an API call. The recent [100 Days of Google Dev video](https://www.youtube.com/watch?v=d5_6yHixpsQ) with [@jaffathecake](https://twitter.com/jaffathecake) goes into details on how to do that, as well as several other techniques (e.g. service workers) that can be used to even further optimize the site.
