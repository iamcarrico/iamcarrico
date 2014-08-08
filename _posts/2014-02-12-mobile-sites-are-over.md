---
layout: post
title:  "Mobi Sites Are Over, Stop Trying"
date:   2014-02-12 12:00:00
categories: rwd mobile-first
redirect_from: "/mobile-sites-are-over/"
---

I have moments of irrational anger toward articles I find on the internet. Today, I found one such article that was a compare and contrast to the benifits of having a mobile site vs having a responsive site. I will be the first to admit that rebuilding a site's front end to be responsive is not an cheap task. It takes time, money, and a team willing to redesign not just the look at feel, but also document hierarchy. But that difficulty should not be feared, it should be surmounted.

<!--more-->

## Why I dislike mobile sites

* Search Engine Optimization: Having a non-performant site, having two different domains (or sub-domains), and duplicate content are all elements on a site that can negatively affect SEO. Check out [Google Webmaster's guide](https://developers.google.com/webmasters/googleforwebmasters/) for a lot more information on how SEO can be improved on a site, and what [Google recomends for mobile](https://developers.google.com/webmasters/smartphone-sites/details).
* User Experience: Many sites have tried to have a mobile site and a desktop site, and generally linking between the two have always hurt a user's experience. XKCD has a [webcomic humourizing](http://xkcd.com/869/) the poor linking that having a mobile redirect has. These problems are even greater if mobile navigation, content, etc are different on the two sites.
* Mobile Redirects: Most redirects rely on user agent sniffing, which is unreliable at best. There have been a [multitude](http://www.sitepoint.com/why-browser-sniffing-stinks/) of [posts](http://farukat.es/journal/2011/02/499-lest-we-forget-or-how-i-learned-whats-so-bad-about-browser-sniffing) on this [subject](https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent), so I shall not beat a dead horse, but it goes against the princliples of feature detection, progressive enhancement, and graceful degradation.
* Social sharing: Johhny is on their phone and shares a link from a site's mobile site on Facebook. Lisa is his friend, sees the link on her desktop and looks at it. Whelp, it is the mobile site and she hates that she cannot see all the content she wants. Moreover, if  share counts are important, there are now have two different sites that are being shared, thus hurting the overall count.
* Budget: The post I read had one excellent point, which is that creating a responsive site will cost more than a templated .mobi site. To create a true responsive site that is mobile-first, we must start the design process from scratch. From my experience, retrofitting a site to be responsive from a current site is far more work than it is worth. That being said, I will always be a proponent of doing the site right once, than poorly twice. If it is not in the budget this year to redesign the site, then put budget away for next year. Less money will be spent long term, and a better product will surface then if a mobile site is used.

## Responsive or bust

A website is a company's image to the world. It is important that a website puts the best foot forward. Mobile sites are dying, and their UX patterns are dying with them. The question between a mobile site or a responsive site is not the right question anymore, but instead is there the time and budget to create a responsive site.
