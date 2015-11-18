---
layout: talk
date: 2015-11-18 17:00:00
title: "Creating your own CDN"
location: SassSummit
permalink: talks/2015/creating-your-own-cdn/
links:
  - title: Slides
    href: https://iamcarrico.github.io/creating-your-own-cdn/
categories:
  - DNS
  - CDN
  - Performance
---

One of the biggest factors in the performance of a site is the latency between the user and the server. The best way to decrease latency is to use a Content Delivery Network (CDN), but sometimes standard products won’t always fit within your needs. This is how I built my own!

You will learn:

* Why it is so important to get content to the user
* Managing several different servers with Ansible playbooks
* Setting up Amazon’s DNS (Route 53) to handle latency-based DNS
* Deploying to multiple servers at once with DeployBot
