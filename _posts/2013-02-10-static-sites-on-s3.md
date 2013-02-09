---
layout: post
title: Static sites on S3

excerpt: A quick shout-out to the technologies that make this blog easy to build
published: false
---

In no particular order, I want to give a quick shout-out to the technologies that make this blog easy to build.

* Cloudflare CDN - These guys are fantastic. I use their free plan on this blog for DNS hosting and speed
* S3 - Cheap storage, not especially fast for serving a website (hence the CDN).
* Jekyll - The gold standard for static blogs.
* Git - Keeps track of every version of everything I write.
* Bootstrap - You have *no idea* how bad this site looked without it.

Thanks also to Ben Schwarz who recently posted [his s3 deploy script](http://germanforblack.com/post/41918581806/how-i-deploy-a-static-site-or-assets-to-s3) (which I shamelessly copied) - saved me digging through the documentation.

Not to mention the constellation of other open source which supports everything I do - from curl/wget to ruby to linux. To every OSS developer out there - thank you!
