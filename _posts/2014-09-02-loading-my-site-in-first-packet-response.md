---
layout: post
title:  "Loading My Site in the First Packet Response"
date:   2014-09-02 09:00:00
shortlink: http://iamc.co/1q58Iv1
categories:
  - performance
  - nginx
  - varnish
  - 1000ms
---

If you've been on my site before, you may have noticed a few changes in the past week. Fonts have been changed up, desgin moved around, and most importantly the site now only loads over https. What is underneath these changes though is much greater, and allows my site to always load in the first packet response in the server. Thus making the load time for my site only rely on latency between a user and my server, and a small piece of server process time. The outcome is that this page should load far below the 1000ms threshold.

## Performance and 1000ms

Performance matters, this has been made clear. [Ilya Grigorik](https://twitter.com/igrigorik) made his famous talk ["Breaking the 1000ms Time to Glass Mobile Barrier"](https://www.youtube.com/watch?v=Il4swGfTOSM) which goes deep into why having a fast, performant site is vital. He also goes into some of the many challenges that are apart of getting content to a user that quickly. For many sites, it is more than just moving JavaScript to the footer, or using a CDN. It takes reevaluating how we deliver out content, and taking into effect the limits of HTTP 1.1.

I set off a few weeks ago, armed with knowledge of the TCP protocol, HTTP 1.1 standard, and a little bit of gumption (and a touch of [scotch](http://www.compassboxwhisky.com/), for good measure), to deliver my site as fast as I could. And I have made immense progress, and decided to show the source code for this site and my server off to the public.

## The Code

I had already built my site using [Jekyll](http://jekyllrb.com/), and I knew I wanted to preserve a static site. Besides simplicity, it also removed the need for a complex server setup, and allowed for more simple hosting. I had already been using GitHub pages for my host, and while it was very fast, it was not enough for my gluttony of speed. I had already made sure my code was minimized and gzipped through the [Mr. Poole Jekyll Tools](https://github.com/iamcarrico/generator-poole), but my PageSpeed score was still lacking. I needed to look beyond just traditional tools if I wanted to break the speed barrier.

### First Load and Beyond

I wanted for my site to load in the first packet response, but also be just as fast for more subsequent page load. This presented an interesting challenge, to ensure every page loaded with the same speed as the first. In my testing, I had found that either I had to load my CSS assets inline, for the first page load, or include them as a link tag for subsequent pulls from the browser cache. If I did the former, the first page load would be fast, but subsequent might take longer. The latter would create blocking on the first load, but subsequent loads would be faster.

I needed to find some middle ground. I needed for two different headers to present depending if this was the first page load or if there was already the file in the cache. Using Varnish edge-side include (ESI) tags, I was able to create a dynamic header, depending on the presence of certain cookies in the browser. If the cookies did not exist, then the CSS would be inlined, and then loaded asnycronously through [LoadCSS](https://github.com/filamentgroup/loadCSS). This would ensure the CSS was in the header for the second page load, where just the plain link tags would be added.

The result is always using the most efficient method of delivery, so that the page will always load quickly. In theory, Varnish will allow caching of each page in pieces, so that it has a copy of the main portion of the body and another for just the header scripts. This should ensure the most efficient delivery of assets from the server.

### Font Loading

Like most frontend developers, I was unhappy with the current methods of loading fonts for my website. It seemed that I was stuck between having to choose between fonts holding up rendering of the page, or a perpetual FOUC on every page load as an asynchronous load happens. I wasn't very happy with either, so instead I used a similar method as the CSS file loading. On the first page load, the fonts are loaded with LoadCSS, which will cause a small FOUC on the first load. From the point forward, they are put in a link tag, ensuring the browser cache loads them from that point forward.

There is still much to be desired with this method though. The fonts currently load with the woff fonts being base64 encoded into the css file, then the rest of the font types optionally loading. Although this works for the majority of browsers, there is still bloat for browsers that do not support woff. In the future, I would like to create a JavaScript test to figure out which font type is used for each browser, and load only the required on. As of yet, I have not been able to figure out the best way to do that, outside of user agent sniffing.

## The Server

Clearly, once I needed to use custom ESI tags, I needed to setup my own server. For this, I employed the use of [Ansible](http://www.ansible.com/home), to manage my server's configuration. I also used [Vagrant]() to be able to create a local environment for me to utilize. The current playbooks I am using are located on my [GitHub profile](https://github.com/iamcarrico/iamcarrico.server), and show the full configuration of my site.

My site had officially become "almost static", remaining static for all but the delivery of CSS assets. After a little bit of research and testing, I setup an [nginx](http://nginx.com/) server to deliver a static site to Varnish, which would dynamically add in the header information. After some recomendations from other developers, I created the production server on [Digital Ocean](www.digitalocean.com/?refcode=ad7f8c567c36). Since it was most familiar, I employed the use of PHP to check the existance of CSS files, and deliver them dynamically. Simple so far, right?

### A Wrench: HTTPS

The realization that I needed my own server also opened up the ability for me to serve the site via https. Jumping on the chance, I knew that Varnish was incapable of serving a site via https. Adding on another layer, I had nginx server the static site to varnish, that served the site to another nginx server. The largest benefit, I had the added benefit of being able to also serve the site with SPDY. Alas, nginx still does not allow for the server pushing assets, which will cause for another review of how the server delivers assets when it can.

As a note, having everything be delivered via https does require an extra handshake to be done by the server. Although this does hurt performance, I believe the round trip of latency is well worth it to ensure user's privacy. As there is a single form on my site, I rather that always be submitted over a secure connection then to risk any of my users information at the sake of one round trip.

### No More Simpleform

Previously, I had used [Simpleform](http://getsimpleform.com/) to collect the one contact us form on the site. I realized (after I went live) that Simpleform does not allow submitting over https. Not wanting users to have to submit data without a little protection, I needed another quick solution for users to submit information to. I quickly wrote a short PHP script that will filter any input, and if there was all the required fields, will create a new issue on a private GitHub repository. It is currently lacking, since it does not provide interactive responses from the server, but it will work for my current needs. Most importantly, it ensures all communication between users and my site is done securely.

## What About a CDN?

The one piece I am missing with this setup is to deliver assets via a CDN. I had checked and tested several options that are available. Every one either did not have the support I needed (read: wanted), or the support I wanted was too expensive for my little blog. Probably the most advanced CDN I was able to find was [MaxCDN](http://www.maxcdn.com/), which if it was not for the cost to deliver different headers based on cookies, would have worked.

## Results

So far, the results are promising. Both [yslow](https://developer.yahoo.com/yslow/) and [Google's PageSpeed](http://developers.google.com/speed/pagespeed/insights/) give me a 98% on the home page. Some [webpagetest.org](http://www.webpagetest.org/) runs give me mostly As, and a B for the Google Analytics score. I know that some more tuning needs to be done to ensure the server is setup 100% correctly, but there is still a fast first byte. Some "in the field" tests I did, generally ensure a very fast load. I did notice early on that the DNS lookup was always very slow. I quickly moved over to [Amazon's Route 53](http://aws.amazon.com/route53/) to try and ensure a better response from DNS servers.

### Whats Next?

The web is always evolving, as is any good website. My work is far from complete when it comes to performance. I have to tune Varnish and nginx to ensure that I am getting the most out of caching and performance on the server. I am also keeping an eye on nginx support of SPDY for its adoption of server push. Any suggestions or ideas are always appreciated, as I know I will be toying with this for some time to come.

### ... but the CODE!

As of today, I am putting the entirety of my codebase on GitHub for all to see. Certainly, it is not perfect yet, and I am still updating and changing constantly. The Ansible scripts and Vagrantfile to create your own server can be found at https://github.com/iamcarrico/iamcarrico.server. And the site itself, created by Jekyll, is at https://github.com/iamcarrico/iamcarrico.
