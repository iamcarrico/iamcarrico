---
layout: post
title:  "Upgrading to HTTP/2"
date:   2016-05-02 12:00:00
categories:
  - performance
  - http2
  - server
  - nginx
image: "/img/2016/sloth_md.jpg"
teaser_image: "/img/2016/sloth_sm.jpg"
description: "HTTP/2 has been around, it is time I upgraded my servers to use it."
---

<figure>
  <img src="/img/2016/sloth_md.jpg" srcset="/img/2016/sloth_sm.jpg 350w, /img/2016/sloth_md.jpg 748w, /img/2016/sloth_lg.jpg 1496w" alt="Sloths, for when you want your site to be faster">
  <figcaption><a href="https://www.flickr.com/photos/nh53/14990032495/" target="\_blank">3-toed Sloth</a> by <a href="https://www.flickr.com/photos/nh53/" target="\_blank">NH53</a> / <a href="https://creativecommons.org/licenses/by/2.0/" target="\_blank">CC BY 2.0</a></figcaption>
</figure>

When I relaunched my site a while back, with an emphasis on performance, I ensured that it was using SPDY. But I have been a little slow to upgrade it to use the full HTTP/2 protocol— primarily because it was low on my list. This weekend, I changed all of that— and fairly quickly got my server running HTTP/2 with very little fuss or mess.

![This was basically me](https://ia.ncarri.co/g/but-i-already-did-something-today.gif)


For anybody interested in just looking at the changes to my NGINX server, I have the [full commit of all the changes to my Ansible playbooks here](https://github.com/iamcarrico/iamcarrico.server/commit/388688edb161b504e995b884e854e4de3dca5ae3).

## Prerequisites

The prerequisites list is really short as HTTP/2 is meant to be able to be put right on top of a server already running HTTP 1.1.

* **Your site must be HTTPS**: Although technically the spec allows for non-TLS implementation, all major browsers require it anyway.
* **NGINX should be at least 1.9.5**: There are early alpha releases, although it is easiest just to use [the version shipped with HTTP/2](https://www.nginx.com/blog/nginx-1-9-5/).

## Updating NGINX

I have been using Ansible to keep my server's configuration consistent. It has made my life much easier. To upgrade NGINX, I just altered the version number in my configuration to be `1.10.0`, and then re-run the [playbooks](https://iamcarrico.com/writings/how-and-why-i-made-my-own-cdn/#the-servers).

For the configuration of the site, make sure to remove all references to `spdy`, as it will cause an error with NGINX. Then within your site configuration, use the `http2` directive to ensure it is enabled.

```
server {
  listen [::]:443 ssl http2;
  listen 443 ssl http2;
  server_name iamcarico.com;

  # Make sure to also have your SSL certificates!
  ssl_certificate /etc/nginx/ssl/server.crt;
  ssl_certificate_key /etc/nginx/ssl/server.key;
}
```

I also like to have a directive to ensure any non-ssl traffic is always redirected to the SSL site. This is not needed for most browsers, as I have added my site to the [HSTS Preload List](https://hstspreload.appspot.com/).

```
server {
  listen [::]:80;
  listen 80;
  server_name iamcarrico.com www.iamcarrico.com;
  return 301 https://iamcarrico.com$request_uri;
}
```

## Testing

![The screen showing your HTTP/2 connections in Chrome](/img/2016/chome-http2-screen.png)

Once you have done the above steps and restarted NGINX, you should be good to go. The easiest way to test is to open your site with Chrome, then in another tab go to `chrome://net-internals/#http2`. You should see your site listed, which shows Chrome has an active HTTP/2 connection open with the site.

That is is, you're done. You now have your site on HTTP/2— and now we can start optimizing for better performance on HTTP/2.

![Congrats! You've earned it.](https://ia.ncarri.co/g/cheers.gif)
