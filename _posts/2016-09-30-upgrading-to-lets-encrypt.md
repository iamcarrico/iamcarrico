---
layout: post
title:  "Upgrading to Let's Encrypt"
date:   2016-09-30 12:00:00
categories:
  - security
  - server
  - nginx
image: "/img/2016/gold-lock_md.jpg"
description: "How I used Let's Encrypt for my own SSL/TLS certificates on all of my web servers."
---

<figure>
  <img src="/img/2016/gold-lock_md.jpg" srcset="/img/2016/gold-lock_sm.jpg 350w, /img/2016/gold-lock_md.jpg 748w, /img/2016/gold-lock_lg.jpg 1496w" alt="A gold lock on a blue door.">
  <figcaption><a href="https://www.flickr.com/photos/fischerfotos/7454996046/" target="\_blank">Gold Lock</a> by <a href="https://www.flickr.com/photos/fischerfotos/" target="\_blank">Mark Fischer</a> / <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="\_blank">CC BY-SA 2.0</a></figcaption>
</figure>

[HTTPS is important](https://theintercept.com/2014/08/15/cat-video-hack/). It is a requirement for all browser implementations of HTTP/2, service workers, and [Mozilla is depreciating non-secure HTTP](https://blog.mozilla.org/security/2015/04/30/deprecating-non-secure-http/). But HTTPS can be hard, and takes more time to setup than what we are used to— not to mention you need to get certificates, and the headache continues.

If you are in this position, stop and read through [Zack Tollman](https://twitter.com/tollmanz)'s (from Wired) [slides on HTTPS right now](https://speakerdeck.com/tollmanz/https-is-coming-are-you-prepared-velocity-2016). It is a great presentation given at Velocity this year that goes over everything you need to know about HTTPS.

Now, I have been using HTTPS for some time, but all of my certificates were from Comodo. Due to the revelations of their [recent antics](https://letsencrypt.org/2016/06/23/defending-our-brand.html), I decided it would be wise to move my certificates over to [Let's Encrypt](https://letsencrypt.org/). The process was fairly straight-forward, but to clear up anything in the documentation I wanted to share how I moved over.

## What is Let's Encrypt

Let's Encrypt is a [free, secure, automatic, transparent, open, and cooperative ](https://letsencrypt.org/about/) certificate authority that allows anybody who owns a domain to get a free SSL/TLS certificate. It has taken the internet by storm, prompting more people the ability to make their sites more secure, and making it free and easy to do so. Needless to say, I was very excited to move to a better way of handling my own certificates.

## My requirements

Since everybody's implementation will be slightly different depending on their setup, this is what I am using on mine.

* I am using Ubuntu 14.04 (Trusty)
* My server ends with nginx
* [I have multiple servers that I serve up my primary domain](/writings/how-and-why-i-made-my-own-cdn/)

## Getting a certificates

First off, I updated my [playbooks](https://github.com/iamcarrico/iamcarrico.server/blob/master/ansible/roles/certs/tasks/main.yml#L6-L8) to download [certbot](https://certbot.eff.org/) by the EFF. If you are not using Ansible then you can run the following (as root) to download the scripts.

Note: For this, most of my actions I did as root to ensure permissions are right on the certificates.

```bash
# Become the superuser `root`
sudo su

# Move into the home directory of root
cd

# Download Certbot
wget https://dl.eff.org/certbot-auto

# Alter certbot so you can execute it.
chmod o+x certbot-auto
```

Running certbot the first time (`./certbot-auto`) will then download and install all needed packages for you to run.

From here, there are several ways to validate your server and get your certificates from `certbot`. Because my server has taken over port 80 and port 443 (TLS/SSL), and redirects all insecure traffic already— I chose to exercise the manual option. For this, you will need two tabs open, both on the server that you will be getting a certificate for.

```bash
# Just a reminder to be root, and be in the root's home directory.
sudo su
cd

# Now, we request the certificate.
./certbot-auto certonly --manual
```

From here, you will be prompted for your email (for key recovery) and the domain name you want for the certificate. `Certbot` will then give you some code to copy and paste into your second window. This code will create a python server to confirm your ownership of the domain. You may have to shut off nginx temporarily for this to work.

### Multiple severs, one domain

I used the above method for all of my server's own endpoint (e.g. [newyork.iamcarrico.com](https://newyork.iamcarrico.com)), but my primary domain is spread out on 4 different servers. For this, I used my New York server as the primary server. I ran the same code as I did before, but then copy/pasted the code Let's Encrypt gave me on each server. Thus, whichever server Let's Encrypt tested from, the same response would be given. I then used sftp to move the certificates for my primary domain to all four servers that use them.


## Updating nginx

Once all of the servers have the right certificates, updating nginx was just a matter of ensuring the servers were pointing at the right certificate. Within my Ansible templates, I created the following configuration:

```
ssl on;
ssl_certificate /etc/letsencrypt/live/{ server_name_template }/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/{ server_name_template }/privkey.pem;
```

Where the `{ server_name_template }` is replaced by the domain name that we are building for. Either `iamcarrico.com`, or the individual server that is being used (e.g `amsterdam.iamcarrico.com`). A quick restart to the nginx server, and my sites are up and running with Let's Encrypt.


### Multiple servers, redux

The problem with my method above, is that it requires a lot of manual work every 90 days or so as certificates expire from Let's Encrypt. I wanted a way of more easily updating my certificates automatically, and received an idea from [an article on the Let's Encrypt community boards](https://community.letsencrypt.org/t/will-lets-encrypt-work-for-me-multiple-servers-serving-one-domain/6830/8/).

I altered my Let's Encrypt setup to use the webroot method, where it will check a specific file exists on my server to confirm ownership. I have set `newyork.iamcarrico.com` set as my primary domain that will hold / renew the primary certificate. All other domains use nginx's `proxy_pass` to redirect to newyork for the certificate confirmation. Within nginx, this looks like:

```
location /.well-known/ {
  proxy_pass https://newyork.iamcarrico.com;
}
```

Or for newyork:

```
location /.well-known/ {
  root /var/www/acme-challenge/;
}
```

Which will then hold the challenge that Let's Encrypt uses to confirm domain ownership. The full code for this [can be found in my Ansible playbooks](https://github.com/iamcarrico/iamcarrico.server/blob/master/ansible/roles/site_config/templates/iamcarrico.j2#L37-L49), and thus far has worked fairly well.

Now, the only manual work I need to do is moving the certificate from one server to another. As of yet, I have not figured out the best way to handle this automatically— but am working on several ideas.

## Renewals

Let's Encrypt's certificates expire after 90 days. They do this to prevent issues with [key compromise, mis-issuances, but also to encourage automation](https://letsencrypt.org/2015/11/09/why-90-days.html). Since I moved my configuration with Let's Encrypt to use the `webroot` method, all I need to do is run the command:

```
./certbot-auto renew
```

Which will automatically renew my certificates when they are close to expiration. For most people, they can setup a cronjob with Asible with:

```
- name: Create a cron task to renew the certificates every other month
 cron:
   name: "letsencrypt renew"
   hour:  "8,20"
   user:   root
   cron_file: letsencrypt_renew
   job: '/root/certbot-auto renew -q --post-hook "service nginx restart"'
```

This will run twice a day (it will only renew when needed). After certbot-auto runs, it will then restart nginx to accept the new certificates.

But, since I need to move my certificates from the primary server, and distribute them to the rest of the servers— this solution will not work perfectly for me. I am working on scripts that will securely share the right files to each server, although as of now that is purely manual.

## Should I use Let's Encrypt?

Yes. Absolutely.

Using [the EFF's certbot-auto](https://certbot.eff.org/) it is quick and easy to setup the certificates for a single server and machine. Even doing it on multiple servers just takes a little bit of finagling, but isn't too difficult.

To give an idea of the ease, I originally set up my certificates on Southwest's in-air Wi-Fi, and still did not have an issue at all. The process is quick, painless, and you can have a secure website before you know it.
