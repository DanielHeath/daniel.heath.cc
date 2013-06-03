---
layout: post
title: The rails asset pipeline: Now for every framework.

excerpt: I integrated sprockets with my framework in an afternoon, and you can too!
---

I recently found myself wanting the features of the rails asset pipeline in my golang project at work.

Since there isn't much in the way of asset pipelining for golang yet, I built it.

Turns out, sprockets is really easy to integrate.

## Assets in development
First things first - lets get to 'it works on my machine'.

I've put together a (sample repo)[https://github.com/DanielHeath/sprockets-sample] using the asset pipeline.

The setup for your app will be similar:
 * The `assets` folder contains your stylesheets, javascript, etc (this directory name is set in sprockets/environment.rb).
 * You'll need a similar `Rakefile` to build assets (and maybe launch the server)
 * You might store the `sprockets` directory somewhere else - update the `Rakefile` to match.
 * Use a Gemfile and the bundler rubygem to manage dependencies.
 * Edit the rakefile to change the port the asset server runs on.

When your app starts (in development), it should make a request to `http://localhost:11111/assets/manifest.json`.

Parse this JSON hash; the keys are asset names (eg "application.css") and the values are relative URLs the compiled assets can be fetched from.

When generating a link to an asset in your app, use the JSON hash you fetched to lookup the URL. In the case of "application.css" this might look like `http://localhost:11111/application-8e5bf6909b33895a72899ee43f5a9d53.css`.

That should be all you need for development - you should be able to see SASS/Coffeescript assets compiled and loading normally.

## Assets in production
For production we want to pre-compile assets rather than regenerating them each time they change.

`rake assets` will create a 'public' folder containing 'manifest.json' (same format as before).
Get this directory onto your production servers (`git add -Af public/` will add it to source control if you deploy via git).

When generating a link to an asset, look up manifest.json (the same as in development, but from the filesystem instead of over HTTP).

## Fin

The whole thing, including deployment, took me well under a day to add to our app.
The resulting assets are minified, concatenated, and gzipped (for size).
They are also fingerprinted (so you can set an unlimited cache lifetime).
