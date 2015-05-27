---
layout: post
title:  "Do it for your users"
date:   2015-05-26 12:00:00
categories:
  - testing
  - performance
shortlink: http://iamc.co/1KxCLGu
description: To answer questions about performance, design, or even testing, I find myself repeating the same question, “What do your users do?” as a response. It seems intuitive, but many times we as web professionals need reminding that we are not creating the web for ourselves, but that we are doing it for our users.
---

To answer questions about performance, design, or even testing, I find myself repeating the same question, “What do your users do?” as a response. It seems intuitive, but many times we as web professionals need reminding that we are not creating the web for ourselves, but that we are doing it for our users.

Little known fact: I used to write a Dear Abby-style advice column*  specific to the web community. I kept some of the letters that were sent to me, and my replies, featured below.

## Example One: Testing

> Dear Ian,
>
> We want to be monitoring our site’s performance. We have started some Web Page Test automation so that we can get more accurate numbers from across the globe on the load times of our site. How many locations is enough for comprehensive testing?
>
From,
>
> Thinking of Every Situation Tirelessly

Dear Test,

Where are your users? If your user base is centered purely around the greater Philadelphia area, your testing (and servers!) should remain there. If there are no users in Eastern Europe that frequent your site, then a test should not be run from there.

On that same note, if your users are spread out over all of Europe and North America, then your monitoring and testing should reflect that. In short, do it for your users.

Warmest,

Ian

## Example Two: Optimizing

> Dear Ian,
>
> On our homepage, we have some images that do not show unless the user clicks on a button. We want the site to load fast, and not download extra content unless needed. But we also want the interaction to load quickly, thus requiring loading those images first? What should we do?
>
> (Also: when are you going to start your very own quippy podcast?)
>
> From,
>
> Prefer Listening Off A Disc

Dear Pre-LOAD,

Before you make any decisions, set up some analytical monitoring. How often do your users click the button? 10% of the time? 20%? 50%? 90%? This should inform whichever road you decide to take.

But that is not all that you should consider: take a look at the size of the images you are loading, the size of the devices that are and are not clicking the button. At the end of the day, you should be able to create a solution that will be optimal for most of your users.

Warmest,

Ian

P.S. No podcast in the works. But I highly recommend http://pathtoperf.com/!!

## Example Three: Design

> Dear Ian,
>
> Looking at your blog, you are clearly an excellent designer. We are having a bit of a conundrum here, and I am afraid it is turning into all out war with our designers. Half want to use the hamburger icon, half want to use the word ‘menu.’ How so ever will we choose?
>
> From,
>
> DEsperately SIGNaling

Dear DESIGN,

I know better than to step between two packs of angry designers, especially about the dreaded hamburger decision. The only advice I will approach on such a delicate topic, is do some user testing. A little bit of A/B testing to see how often the menu is clicked which should provide some insight into how your users are interacting with your site. I would also recommend avoiding the cheeseburger, you don’t know if your users are lactose intolerant!

Warmest,

Ian

## But what does it all mean, Basil?

Obviously, these examples are over-simplifications. Rarely is a decision as easy as knowing that 90% of your users demonstrate one behavior. Usually, it is a more grey-area decision, where 50-60% of users exhibit the expected or desired behaviors.

We cannot make the right choices without all the data. User testing is as important as it has ever been, if not more. Do Real User Monitoring (RUM) for performance metrics, AND perform synthetic testing in conditions as close to your real-world users as possible. Accurate decisions cannot be made unless the perspective of the user has been fully taken into account.

Make decisions based on your users’ behaviors and needs, not what we might think the user _might_ do, or what we want the user to do. At the end of the day, we are building websites for our users. So go ahead, do it for your users.

<br>
<br>
 \* I never wrote for Dear Abby.
