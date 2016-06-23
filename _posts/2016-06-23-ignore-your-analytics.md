---
layout: post
title:  "Ignore your analytics"
date:   2016-06-23 12:00:00
categories:
  - performance
  - web development
  - UX
image: "img/2016/a-very-angry-man_md.jpg"
description: "Performance is an extension of user experience— our work is to make the user feel better using our site. Why don't we use our user's happiness as a metric for performance tests?"
---

<figure>
  <img src="/img/2016/a-very-angry-man_md.jpg" srcset="/img/2016/a-very-angry-man_sm.jpg 350w, /img/2016/a-very-angry-man_md.jpg 748w, /img/2016/a-very-angry-man_lg.jpg 1496w" alt="This might be how your users are reacting right now">
  <figcaption><a href="https://www.flickr.com/photos/barkbud/4544202389/" target="\_blank">uh oh</a> by <a href="https://www.flickr.com/photos/barkbud/" target="\_blank">bark</a> / <a href="https://creativecommons.org/licenses/by/2.0/" target="\_blank">CC BY 2.0</a></figcaption>
</figure>

There are a variety of methods for performance engineers to monitor their sites, SpeedIndex, start render, DOMContentLoaded, the list goes on and on. There is even work being done to make these numerical metrics to reference when users can actually interact with content. We have PerformanceTiming, and other web APIs to have application-specific performance analytics.

This post isn't about any of these things, this post will introduce a heretical idea about these metrics. Ignore them. All of them. Now get your phone out, turn off the wifi, and use your own site. Use it while you travel, use it while you're in a city, while you're in the country, use it when you have great LTE coverage, and use it while you have terrible 3G (or even edge). Use it in a house, use it with a mouse, use it in a box, use it with a fox. How does it feel? What annoys you about it? What isn't interactive when you want it to be? What parts of it seem slow or behind the curve?

There is a propensity of performance engineers to rely purely on the data, and forget the feelings of the users that are on our sites ever day. Certainly, I am guilty of this, and have to remind myself to self-test (and take feedback from coworkers, friends, etc.) each of our sites.

At the end of the day, performance is an extension of user experience&mdash; and our goal is to ensure that each user has the best experience while on our sites. We should be doing real user-testing of our sites, polling for actual user feedback on their experience on our site. We should be adding in UX testing to supplement our analytics data.

But knowing that as engineers, we want metrics on how well our sites are doing&mdash; I have some pseudo-metrics that can be used in place of our standard metrics that take into account the user's experience on the site:

* How often [comments on The Verge are made complaining about performance](http://www.theverge.com/2016/5/21/11734016/why-is-the-verge-so-slow)
* Frequency of emails from support of complaints on our support forms
* How often [performance talks](https://yoavweiss.github.io/taking_back_control_velocity_16/#6) involve The Verge as the "don't do this" example
* Individual mentions of your team by [Paul Irish](https://twitter.com/paul_irish/status/621388292680847360)
* Time to first [angry tweet](https://twitter.com/robertgaal/status/677547029615149056)

What are your ideas to monitor our own user's experience on our sites? How can we ensure to pull in their feedback into our work? I am no UX testing expert, and this is only a thought— one that needs more expounding upon.
