---
layout: post
title:  "How (and why) I created my own CDN"
date:   2015-06-08 12:00:00
categories:
  - performance
  - CDN
image: img/2014/2015/global_network_md.jpg
description: "My site loads two different pages depending on whether or not there are cookies set that mark the CSS and fonts have been loaded already. There was no CDN that would allow me to do this without immense cost. I did what any sane developer would do, I created my own CDN."
---

<figure>
  <img src="/img/2015/global_network_md.jpg" srcset="/img/2015/global_network_sm.jpg 350w, /img/2015/global_network_md.jpg 748w, /img/2015/global_network_lg.jpg 1496w" alt="Global CDNs are a requirement">
  <figcaption><a href="https://www.flickr.com/photos/marcela-palma/12239000755/in/photolist-b3AtCt-jDw5wp-taB9TL-tEj534-tnJ2bb-tBYHHY-tnJ2qQ-o562bA-o6mxio-tE11s1-u5ZcnJ-tbt3xP-kKgCL8-tQSSec-tbiTTd-tQRKkK-u8hKni-u7XgXd-tfvquG-hxk7mm-i5UZkT-twPaLA-fboVJR-joqc54" target="\_blank">Internet computer business</a> by <a href="https://www.flickr.com/photos/marcela-palma/" target="\_blank">Marcela Palma</a> / <a href="https://creativecommons.org/licenses/by-nc-sa/2.0/" target="\_blank">CC BY-NC-SA 2.0</a></figcaption>
</figure>

Before we begin I am just going to say it: You probably don’t need to do this. There are many great CDN options out there that are great. But, I had specific requirements that made it a necessity that I build my own. I would highly recommend MaxCDN for your own use; I have had great interactions with their team.

## Then why did you?

My site loads two different pages depending on whether or not there are cookies set that mark the CSS and fonts have been loaded already. If they are, the server assumes they are in the cache and can be loaded with a normal <link> tag, pulling from the browser cache. If not, then the CSS is set inline, and the Font Face Observer is used to asynchronously ensure the fonts are loaded before showing them (preventing FOIT). This pulls from techniques I talked about in my [first blog post on this site’s performance](https://iamcarrico.com/writings/loading-my-site-in-first-packet-response/), and more recently the [Filament’s Group work on prevent FOIT](http://www.filamentgroup.com/lab/font-events.html) on their site.

What these techniques come down to however, is that I needed a CDN that would allow different content to be cached depending on the value of two cookies. I searched far and wide for a CDN that would allow this, and although many would— it required I have an enterprise plan to use them. Certainly, this humble website does not have the $5,000 / month budget required for such an endeavour. Thus: I had to figure out my own way of creating a CDN.

## The servers

I have four servers, spread out across the globe in New York, Amsterdam, San Francisco and Singapore. Each are one of [Digital Ocean’s](https://www.digitalocean.com/) smallest servers, with full IPv6 support. I selected Digital Ocean primarily because of the cost and the locations. They are much cheaper than AWS or Rackspace, just as powerful as I need them to be, but also spread out decently well to where my traffic comes from. The only place that I wish there was a datacenter was South America, as I have seen a good amount of traffic coming from there.

The servers are managed with [Ansible](http://www.ansible.com/home). The source code for my playbooks are [up on GitHub](https://github.com/iamcarrico/iamcarrico.server), and although there are some changes I would like to make, it does the job very well. Configuration is all stored inside the repository, and the few variables I have between servers (e.g. hostname) are filled into template automatically.

I can deploy any changes I need just by running ```ansible-playbook -i hosts playbook.yml --limit production```, which will go to every production server and update them accordingly. Alternatively, I can setup a new server by adding it to the ```hosts``` file, then running ```ansible-playbook -i hosts playbook.yml --limit the.new.hostname```. Just last week, I setup a new server with about 20 min of work, and that is only because I have some [user and permissions work](https://github.com/iamcarrico/iamcarrico.server/issues/9) that I would like to add to the playbooks. The results are that I have four servers, all in different parts of the world, all setup exactly the same, and all with the exact same files on them.

## DNS

<figure>
  <img src="/img/2015/aws_dns_info_md.png" srcset="/img/2015/aws_dns_info_md.png 748w, /img/2015/aws_dns_info_lg.png 1496w" alt="AWS Route 53 interface">
  <figcaption>The servers I have setup within AWS's system.</figcaption>
</figure>

Having four servers is only part of the problem though, how do I get users to get to the server closest to them? I looked at several DNS providers from Dyn to Zerigo, but only one provided the features I needed for a reasonable cost. Amazon’s [Route 53](https://aws.amazon.com/route53/) costs me $6 / year to have each DNS lookup direct users to whatever the closest server is based on latency.

This works well mostly because Amazon’s data centers are relatively close to Digital Ocean’s. Meaning that the data Amazon keeps on latency, which is how they determine which server to send traffic to, is very similar to the latency from the Digital Ocean servers I have set up. The results are that for most places across the globe that I receive traffic from, the round trip time is below 50ms. The slowest is 220ms for Melbourne, Australlia. Route 53 has the added benefit that I can also use it to host IPv6 data, as all of my servers can be accessed by both IPv4 and IPv6.

## Deployment

The final piece to the puzzle is how to deploy to each server without requiring a bunch of extra work. Already, I have a gulp task that compiles my Jekyll site and run some optimizations just by running ```gulp deploy```. This also commits to the [live branch](https://github.com/iamcarrico/iamcarrico/tree/live) of my repository with the files ready for the server. The missing piece was how to push those changes to four servers at the same time, without causing any downtime. I first thought about using Ansible, but did not want to be stuck unable to deploy to servers if I had issues with my local machine in whatever way.

<figure>
  <img src="/img/2015/dploy_md.png" srcset="/img/2015/dploy_md.png 748w, /img/2015/dploy_lg.png 1496w" alt="My dploy.io dashboard">
  <figcaption>Dploy.io makes deployment incredibly easy, with helpful status messages</figcaption>
</figure>

The solution, was [dploy.io](http://dploy.io/). A simple deployment tool, free for my single repository and user, that could deploy to each of my servers at one. All it took was to create a ```dploy``` user on each server, and assign it the proper sudo permissions to only restart Varnish.

```
# Allow members of deployment to execute deployment commands.
%deployment ALL=NOPASSWD:/etc/init.d/varnish restart
```

## Results

I have four servers across the globe. Each server has the same configuration and the same files. I can relatively easily spin up new servers, and add them to Route 53’s latency-based routing tables. Round Trip Times are decreased for most users, and most users get a faster experience than if I only had one. Most importantly, I can do all of this while still having the cookie-based cache system to load sites as fast as possible.

<img src="http://i.giphy.com/9w9Bpoiddg72U.gif" alt="That was kind of awesome, right?">
