---
layout: post
title:  "HillaryClinton.com Performance Audit"
date:   2015-05-27 12:00:00
categories:
  - perf-audit
  - performance
description: A performance review of the HillaryClinton.com site, and optimization suggestions to increase the performance of the site.
---

There are many ways that every site can improve it's performance. In an ever-growing internet, where the [average page size just surpassed 2MB](http://httparchive.org/trends.php#bytesTotal&reqTotal), performance is becoming more and more key to a successful site.

To that goal, I put together a [performance audit of Hillary Clinton’s campaign site](http://iamc.co/hc-perf), and put together a list of suggestions. I chose this site as it is a high-traffic site that will be getting more traffic as the election gets closer— not for any political affiliation or goals.

For the review, I mainly used Chrome Canary, but also utilized Web Page Test and Page Speed Insights. One of the features I finally enabled in Chrome for a better visual view of the page load is the filmstrip view. To enable it yourself, follow these steps:

1. Go to `chrome://flags/` in Google Chrome
2. Enable "Developer Tools experiments", restart the browser
3. Go to the settings pane within the Developer Tools (the gear icon)
4. Click "Experiments" in the left-hand navigation
5. Press the shift key 6 times
6. Enable "Filmstrip in Network and Timeline Panel"
7. Restart the Developer Tools, and then click the camera icon on the top-left.

Check out the whole review up on Google Docs at [http://iamc.co/hc-perf](http://iamc.co/hc-perf), and let me know what you think.
